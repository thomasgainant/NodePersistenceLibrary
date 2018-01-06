class Test{
	constructor(variable1, variable2){
		this.variable1 = variable1;
		this.variable2 = variable2;
	}

	testMethod(){
		return this.variable1 + 2;
	}
}

module.exports = {
	Test
}