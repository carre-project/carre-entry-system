[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/carre-project/carre-entry-system/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
[ ![Codeship Status for carre-project/carre-entry-system](https://codeship.com/projects/493e7480-6b0c-0133-0666-1a8865ac42d3/status?branch=master)](https://codeship.com/projects/115092)
[![Build Status](https://travis-ci.org/carre-project/carre-entry-system.svg)](https://travis-ci.org/carre-project/carre-entry-system)
##

Production DUTH server: [entry.duth.carre-project.eu](http://entry.duth.carre-project.eu)

Production server: [entry.carre-project.eu](http://entry.carre-project.eu)


## CARRE Risk Model Semantic Data Entry System v2.0

![CARRE Risk Concenptual Model](http://entry.carre-project.eu/assets/images/model.jpg)

The CARRE risk entry system enables the [medical experts][1] in the [CARRE project][2] to encode the risk factors between biological, demographic, lifestyle and environmental elements and clinical outcomes in accordance with evidence from the clinical literature. The presented system is based fundamentally on Linked Data principles, and so in order to make the best use of these encoded factors, they are available as Linked Data through the [CARRE SPARQL Endpoint][3], making use of control vocabularies ([UMLS][4] , SNOMED, etc.) and the [CARRE risk factor ontology][5]; specifically, they are encoded in the (standard) Resource Description Framework ([RDF][6]) format.

The system has been developed as a client side web application that follows the [Microservices][7] architectural style and provides native RDF support via the [CARRE API][8] and the [CARRE SPARQL Endpoint][3]. Moreover custom form components have been developed to reflect the structure of the [CARRE risk factor ontology][5], so that citations, observables, risk elements, risk evidences and risk factors are automatically stored into the CARRE RDF triple store. The CARRE risk entry system is implemented in [HTML5][9], CSS and [JavaScript][10] using the [AngularJS][11] framework. The system is open source and the source code is available at [GitHub][12]. The system maintains referential integrity, so that if "diabetes" is entered as a risk element entity, then a risk factor representing an observed link between diabetes and hypertension will refer to the existing diabetes risk element entity. Medical experts are supported in the reuse of data already entered into the system by the user interface, which allows existing relevant entities to be selected via appropriate searchable lists wherever possible.

Web development: [Nick Portokallidis][13]

Data cleansing: [George Drosatos][14]

Scientific supervision: [Eleni Kaldoudi][15]

[1]: http://entry.carre-project.eu/medical_experts
[2]: http://www.carre-project.eu/
[3]: http://carre.kmi.open.ac.uk:8890/sparql
[4]: https://www.nlm.nih.gov/research/umls/
[5]: http://bioportal.bioontology.org/ontologies/CARRE
[6]: http://www.w3.org/RDF/
[7]: http://microservices.io/
[8]: https://carre.kmi.open.ac.uk/ws/
[9]: http://www.w3.org/TR/html5/
[10]: https://www.javascript.com/
[11]: https://angularjs.org/
[12]: https://github.com/carre-project/carre-entry-system
[13]: http://nporto.com/
[14]: http://drosatos.info/
[15]: http://iris.med.duth.gr/kaldoudi/en/
  
  
## Installation

``` 
git clone https://github.com/carre-project/carre-entry-system.git 
npm install
```
## Run

```npm run dev``` : for development version

```npm run prod``` : for production version


## Production deployment
```
./build
serve the `dist` folder with a static webserver of your choice (apache,nginx,etc..)

```