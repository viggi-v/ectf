function arrayHandler(){
	/*
	 * Custom Service to handle an array of objects
	 * Can find the index of an object and delete an object from an array,
	 * by searching with a key:value pair.
	 */

	/* 
	 * @param
	 * array of objects, a property that has to be searched for, and the value of the property.
	 * by default they return/delete the first occurence 
	 * but can be made to return/delete all instances.
	 */ 
	
	this.findByMatch = function(array,property,value, findFirst=true){
		var indices = [];
		var flag = true;
		var pos = 0;
		array.forEach(function(object,index){
			if(object.hasOwnProperty(property) && object[property] == value){
				if(findFirst && flag){
					pos = index;
					flag = false;
				}
				indices.push(index);
			}
		});
		if(!findFirst)
			return indices;
		else
			return pos;
	};

	this.deleteByMatch = function(array,property,value,findFirst=true){
		array.forEach(function(object,index){
			if(object.hasOwnProperty(property) && object[property] == value){
				array.splice(index,1);
				if(findFirst){
					return;
				}
			}
		});	
	}
}
angular.module("mainApp")
	.service('arrayHandler',arrayHandler);