angular.module('CarreEntrySystem').service('User', function($http,CONFIG,$cookies) {

 
    // Retrieving a cookie and set initial user object
    var TOKEN = $cookies.get('CARRE_USER') || CONFIG.TEST_TOKEN || '';
    var user = {};
    return function(){
        //validate cookie token with userProfile api function and get username userGraph
        if (TOKEN.length > 0 && !user.username) {
          $http.get(CONFIG.API + 'userProfile?token=' + TOKEN).then(function(res) {
            user = {
              oauth_token: TOKEN,
              username: res.data.username,
              email: res.data.email
            };
            console.log("User service",user);
            return user;
              
          }, function(err) {
                return false;
            console.log(err);
          });
        } else return user;
    };
});