(function(){
    "use strict";
    angular.module(APP.MODULE.COMMON).config(['$provide', '$logProvider',logConfig]);

    function logConfig($provide, $logProvider) {
        $provide.decorator('$log', function ($delegate) {
            var originalFns = {};

            // Store the original log functions
            angular.forEach($delegate, function (originalFunction, functionName) {
                originalFns[functionName] = originalFunction;
            });

            var functionsToDecorate = ['log','info','debug', 'warn'];

            // Apply the decorations
            angular.forEach(functionsToDecorate, function (functionName) {
                $delegate[functionName] = logDecorator(originalFns[functionName]);
            });

            return $delegate;
        });
    };


    function logDecorator(fn) {
        return function () {
            var args = [].slice.call(arguments);

            // Insert a separator between the existing log message(s) and what we're adding.

            // Use (instance of Error)'s stack to get the current line.
            var stack = (new Error()).stack.split('\n').slice(1);

            // Throw away the first item because it is the `$log.fn()` function, 
            // but we want the code that called `$log.fn()`.
            stack.shift();
            
            var callerStackline = stack[0].trim();

            //var regex = new RegExp (/\(([^()]+)\)/g);
            
            var callingFile = callerStackline.match(/\(([^()]+)\)/g);
            //extract what we want. 
            var splitLine = callerStackline.split(" "); 
            var callingFunction = splitLine[1]; 
            var a = callingFile[0].split(":");
            
            var splitFilePath = a[1].split("/");
            var file = splitFilePath[splitFilePath.length-1];
            var line = a[2];

            args.unshift(file+":"+line+":"+callingFunction);

            // Call the original function with the new args.
            fn.apply(fn, args);
        };
    };

})();