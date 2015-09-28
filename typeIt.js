/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @copyright 2015 Alex MacArthur
 * @description Types out a given string.
 */

 (function($){

   $.fn.typeIt = function(options){
     var settings = $.extend({
       stringToType : 'This will be typed!'
    }, options);

    var theElement = this;
    var theString = settings.stringToType;
    var characterArray = theString.split('');

    for (var i = 0; i < characterArray.length; i++) {
        theElement.append(characterArray[i]);
    }

   };

 }(jQuery));
