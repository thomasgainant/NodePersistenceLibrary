var Tests = require('./classes/test.class.js');

var fs = require('fs');
var parse = require('xml-parser');
var beans = require('./bean.class.js');

class Persistence{
	constructor(confFile){
		var that = this;

		this.beans = [];

		var xml = fs.readFileSync(confFile, 'utf8');
		var conf = parse(xml);

		this.classesFolder = conf.root.children[0].content;
		this.classes = [];
		fs.readdirSync(this.classesFolder).forEach(file => {
		  this.classes.push(file);
		});

		this.mappingFolder = conf.root.children[1].content;
		this.mapping = [];
		fs.readdirSync(this.mappingFolder).forEach(file => {
			this.mapping.push(file);
		});

		this.beanHandlerThread = setInterval(function(){that.beanHandler(that)}, 1000);
	}

	persist(instance){
		var instanceClassName = instance.constructor.name;

		/*var isInsideClassFolder = false;
		for(let className of this.classes){
			if(className == instanceClassName){
				isInsideClassFolder = true;
				break;
			}
		}*/

		var isInsideMappingFolder = false;
		for(let mappingName of this.mapping){
			if(mappingName == instanceClassName+".mapping"){
				isInsideMappingFolder = true;
				break;
			}
		}

		//if(isInsideClassFolder && isInsideMappingFolder){
		if(isInsideMappingFolder){
			var xml = fs.readFileSync(this.mappingFolder+'/'+instanceClassName+'.mapping', 'utf8');
			var raw = parse(xml);

			var vars = [];
			for(let child of raw.root.children){
				if(child.name == "var"){
					vars.push(child.attributes.name);
				}
			}

			var bean = new beans.Bean(instance, vars);
			this.beans.push(bean);
			bean.saveMongo();
		}
		else{
			//TODO error
		}

		return instance;
	};

	destroy(instance){
		var that = this;

		var index = 0;
		for(let bean of that.beans){
			if(bean.instance == instance){
				bean.delete();
				//console.log(that.beans);
				that.beans.splice(index, 1);
				//console.log(that.beans);
				instance = null;
			}
			index++;
		}
	}

	beanHandler(persistenceScope){
		for(let bean of persistenceScope.beans){
			for(let instVar in bean.instance){
				if(bean.instance == null){
					bean.delete();
				}
				else{
					if(bean.values[instVar] != bean.instance[instVar]){
						//console.log("dirty bean");
						bean.values[instVar] = bean.instance[instVar];
						bean.save();
					}
				}
			}
		}
	}
}

module.exports = {
	Persistence
}

/*
* EXAMPLE
*/

var persistence = new Persistence('npl.conf');
var testInstance = persistence.persist(new Tests.Test(123, "lorem ipsum"));

setTimeout(function(){testInstance.variable1 = 346;}, 5000);
setTimeout(function(){testInstance.variable1 = 123;}, 10000);
//setTimeout(function(){testInstance = null;}, 15000);
setTimeout(function(){persistence.destroy(testInstance)}, 15000);