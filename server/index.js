'use strict';

var express = require('express'),
    cors = require('cors'),
    compression = require('compression'),
    Promise = require("bluebird"),
    request = Promise.promisifyAll(require("request")),
    mcache = require('memory-cache'),
    app = express(),
    nodemailer = require('nodemailer'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    bodyParser = require('body-parser'),
    fallback = require('express-history-api-fallback');
var Store = require("jfs");
var db = new Store("data/data",{type:'single'});

// express middleware plugins
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
app.use(compression());

    
    
/* CONFIG */
var SERVER_PORT = process.env.PORT||80;
var PASSWORD = process.env.PASSWORD||'demo1234';



/* ! ROUTES ! */

// CARRE api cache route!
app.get('/api/carreapi/:req_url_id/:original_api/:original_query/:token?', cache(), handleCarreApiCache);

//invalidate and refresh portion or whole cache from requests saved in file
app.get('/api/refresh_cache/:req_url_id?/:delete?', refreshCache);

//email route
app.post('/api/sendemail', sendEmail);



/* Simple secondary routes */

//get all memory cache available
app.get('/api/get_cache', (req, res) => {
    res.status(200).json({
        total_elements: mcache.size(),
        elements: mcache.keys()
    });
});
//get all requests that saved to file
app.get('/api/get_requests', (req, res) => {
    res.status(200).json(db.allSync());
});
//Clear requests
app.get('/api/clear_requests/:password', (req, res) => {
    var cachedRequests=0;
    if(req.params.password!==PASSWORD) res.status(404).send('Not found');
    else {
        for(var prop in db.allSync()) { db.delete(prop); cachedRequests++;}
        res.status(200).json({msg:"Cleared "+cachedRequests+" requests",data:cachedRequests});
    }
});
//Clear memory cache
app.get('/api/clear_cache/:password', (req, res) => {
    if(req.params.password!==PASSWORD) res.status(404).send('Not found');
    else {
        var cachesize=mcache.size();
        mcache.clear();
        res.status(200).json({msg:"Cleared "+cachesize+" items",data:cachesize});
    }
});


app.get('/config.js',(req,res)=> {
    res.set('Content-Type', 'text/javascript');
      if(process.env.NODE_ENV!=='production') {
        console.log('NOT sending file',process.env.NODE_ENV)
          res.status(200).send("");
      } else {
        console.log('sending config.js',process.env.NODE_ENV)
      res.status(200).send(`
    window.CARRE_ENTRY_SYSTEM_CONFIGURATION = {
        language:'en',
        api_url:'https://carre.kmi.open.ac.uk/ws/',
        authentication_url:'https://devices.carre-project.eu/devices/accounts/',
        graph_url:'http://carre.kmi.open.ac.uk/'
      };
      `);
      }
});


// redirect all the other routes to index.html
var root = __dirname + '/../dist';
app.use(express.static(root));
app.use(fallback('index.html', { root: root }));


app.listen(SERVER_PORT, function() {
    console.log('Entry system server listening on port: ', SERVER_PORT);
});



/* MAIN FUNCTIONS */ 

//synchronous requests with recursive technique
function callAPIs( APIs ) {
  var API = APIs.shift();
  setTimeout(function(){
    console.log(API);
      request(API, function(err, res, body) { 
        if( APIs.length ) {
          callAPIs ( APIs );
        }
      });
  },3000);
}

// memory cache implementation
function cache() {
    return (req, res, next) => {
        let key = req.params.req_url_id || ('__express__' + req.originalUrl || req.url);
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            console.log('Load from CACHE:', key);
            res.status(200).send(cachedBody);
            return
        }
        else next();
    }
}

function sendEmail(req, res) {
    var action=req.body.action;
    var data=req.body.reqdata;
    var user=req.body.user;
    var parsedData = JSON.parse(data);
    var title = parsedData.title?parsedData.title:"";
    console.log(title);
    
    var sendgrid=nodemailer.createTransport(sgTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY||'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'
        }
    }));
    
    // send mail
    sendgrid.sendMail({
        from: process.env.EMAIL_FROM || 'entry.system@nporto.com',
        to: process.env.EMAIL_TO || 'portokallidis@gmail.com',
        subject: 'CARRE entry system: '+action +" "+ title,
        text: 'From user: '+user+'\n\n'+data
    }, function(error, response) {
       if (error) {
            console.log(error);
       } else {
            console.log('Message sent');
       }
    });

    res.status(200).json({msg:'ok'});
}

function refreshCache(req,res) {
    var req_id = req.params.req_url_id?req.params.req_url_id.split(','):null;
    var cacheRequests = db.allSync();
    var results=[];
    for(var prop in cacheRequests) {
        if(req_id) {
            for (var i=0,len=req_id.length;i<len;i++){
                if(prop.indexOf(req_id[i])>=0) {
                    
                    //delete from memory
                    mcache.del(prop);
                    
                    //delete request from filesystem
                    if(req.params.delete) db.delete(prop);
                    
                    //push into refreshing cue
                    
                    results.push('http://localhost'+cacheRequests[prop].req);
                }
            }
        } else results.push('http://localhost'+cacheRequests[prop].req);
    }
    if(results.length>0) callAPIs(results);
    
    res.status(200).json({
        request: req_id||"refresh all cache",
        ttl:(results.length+1)*3+" sec"
    });
}


function handleCarreApiCache(req, res) {
    // console.log('Params:',req.params);
    var cacheKey = req.params.req_url_id;
    var token = req.params.token || '';
    var json = {
        sparql: req.params.original_query,
        token: token
    };
    if (cacheKey.indexOf('public_') === 0) {
        delete json.token;
    }
    
    //Lets configure and request
    request({
        url: req.params.original_api.replace("https://","http://"), //replace https->http HACK should be removed
        method: 'POST',
        json: json
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        }
        else if (body.status == 500) {
            console.log(body);
        }
        else {
            console.log('Load from API:', cacheKey);
            res.status(200).send(body);

            //put on cache
            mcache.put(cacheKey, body);
            
            //save request to disk
            db.save(cacheKey,{req:req.originalUrl},function(err,data){
                console.log(err,data);
            }); 
    
        }
    });
}

// /* Extra test functions */    
// setInterval(function(){
    

// var TestQuery="http://carre.kmi.open.ac.uk:8890/sparql?default-graph-uri=http%3A%2F%2Fcarre.kmi.open.ac.uk%2Friskdata&query=select+*+where+%7B%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Frisk_evidences%2FRV_16%3E+%3Chttp%3A%2F%2Fcarre.kmi.open.ac.uk%2Fontology%2Frisk.owl%23has_risk_evidence_ratio_value%3E+%3Fratio+%7D+LIMIT+100&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";

// request({ url: TestQuery, method: 'GET'}, function(error, response, body) {
//         if (error) {
//             console.log(error);
//         }
//         else if (body.status == 500) {
//             console.log(body);
//         }
//         else {
//             var result = JSON.parse(body).results.bindings[0].ratio.value;
//             console.log("Result:",result);
                
//             var sendgrid=nodemailer.createTransport(sgTransport({
//                 auth: {
//                     api_key: process.env.SENDGRID_API_KEY||'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'
//                 }
//             }));
            
//             if(result == "NAN") {
                
//                 // send mail
//                 sendgrid.sendMail({
//                     from: process.env.EMAIL_FROM || 'entry.system@nporto.com',
//                     to: process.env.EMAIL_TO || 'portokallidis@gmail.com',
//                     subject: 'NaN test for RV_16: '+result,
//                     text: 'NaN test for RV_16: '+result
//                 }, function(error, response) {
//                   if (error) {
//                         console.log(error);
//                   } else {
//                         console.log('Message sent');
//                   }
//                 });
//             }
    
//         }
//     });

    
    
    
// },60000);