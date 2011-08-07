/*
---

script: Chain.Singleton.js

description: Defines and instantiates a singleton Class.

license: MIT-style license.

authors:
- Eneko Alonso

requires: 
- core:1.2.4/Class
- /MooTools.More

provides: [Class.Singleton]

...
*/

Class.Singleton = new Class({

	initialize: function(classDefinition, options){
		var singletonClass = new Class(classDefinition);
		return new singletonClass(options);
	}

});
