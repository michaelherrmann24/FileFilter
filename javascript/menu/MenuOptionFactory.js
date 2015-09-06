(function(){
	"use strict";
	angular.module(APP.MODULE.MENU).service("menuOptionFactory", ['menuOption','filterOption',menuOptionFactory]);
	
	function menuOptionFactory(menuOption,filterOption){
		

		function MenuOptionFactory(){

		}

		/*
		* factory function to return the compile funtion to use for the menu selector. 
		*
		*/
		MenuOptionFactory.getMenuOption = function(tElement,tAttrs){
			console.debug("MenuOptionFactory.getMenuOption",tElement,tAttrs);
			var rtn;

			switch(tAttrs.menuSelector) {
    			case "filter":
        			rtn = filterOption.newInstance(tElement,tAttrs);
       	 			break;
    			default:
        			rtn = menuOption.newInstance(tElement,tAttrs);
			}

			console.debug("menuOptionFactory",rtn);
			return rtn;

		}
		return MenuOptionFactory;
	};
})(); 
