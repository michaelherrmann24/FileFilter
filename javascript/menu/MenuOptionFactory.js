(function(){
	"use strict";
	angular.module(APP.MODULE.MENU).service("MenuOptionFactory", ['MenuOption','FilterOption',menuOptionFactory]);

	function menuOptionFactory(MenuOption,FilterOption){

		function MenuOptionFactory(){}

		/*
		* factory function to return the compile funtion to use for the menu selector.
		*
		*/
		MenuOptionFactory.getMenuOption = function(tElement,tAttrs){
			console.debug("getMenuOption",tElement,tAttrs);
			var rtn;
			switch(tAttrs.menuSelector) {
				case "filter":
        			rtn = new FilterOption(tElement,tAttrs);
       	 			break;
    			default:
        			rtn = new MenuOption(tElement,tAttrs);
			}
			return rtn;

		}
		return MenuOptionFactory;
	};
})();
