 return {
    restrict: 'A',
    template: '<div></div>',
    templateUrl: 'directive.html',
    replace: false,
    priority: 0,
    transclude: false, //   true|false|element
    scope: false, //false- use parent scope (default) , true - own but from parent,  
//    	{@ – binds the value of parent scope property (which always a string) to the local scope. So the value you want to pass in should be wrapped in {{}}. Remember `a` in braces.
//    	= – binds parent scope property directly which will be evaluated before being passed in.
//    	& – binds an expression or method which will be executed in the context of the scope it belongs.}
    terminal: false,
    require: false,   // ^ parent directive  ? optional
    controller: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
    compile: function compile(tElement, tAttrs, transclude) {
    	
    	//this is link
      return {
        pre: function preLink(scope, iElement, iAttrs, controller) { ... },
        post: function postLink(scope, iElement, iAttrs, controller) { ... }
      }
    },
    link: function postLink(scope, iElement, iAttrs) { ... }
  };