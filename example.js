var Tests = require('./classes/test.class.js');
var NPL = require('node-persistence-library');

/*
* EXAMPLE
*/

var persistence = new NPL.Persistence('npl.conf');
var testInstance = persistence.persist(new Tests.Test(123, "lorem ipsum"));

setTimeout(function(){testInstance.variable1 = 346;}, 5000);
setTimeout(function(){testInstance.variable1 = 123;}, 10000);
//setTimeout(function(){testInstance = null;}, 15000);
setTimeout(function(){persistence.destroy(testInstance)}, 15000);