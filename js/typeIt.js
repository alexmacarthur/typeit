/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @copyright 2015 Alex MacArthur
 * @description Types out a given string.
 */

 (function($){

   $.fn.typeIt = function(options){

    var dataSettings = {
      whatToType : this.data('typeitString'),
      typeSpeed: this.data('typeitSpeed'),
      lifeLike: this.data('typeitLifelike'),
      showCursor: this.data('typeitShowcursor')
    };

    var settings = $.extend({
       whatToType : ['aaaaa','xxxxx','yyyyy'],
       typeSpeed: 500,
       lifeLike: true,
       showCursor: true
    }, options, dataSettings);

    var theElement = this;
    var typeSpeed = settings.typeSpeed;
    var delayTime = settings.typeSpeed;
    var mergedStrings = settings.whatToType.join('');

    if(settings.showCursor === true){
      theElement.addClass('ti-cursor');
      theElement.css('position','relative');
    }

    var stringArrayLength = settings.whatToType.length;
    for (var i = 0; i < stringArrayLength; i++){

      var theString = settings.whatToType[i];
      var characterArray = theString.split('');

      typeStuff();

    }

    function typeStuff(){
      // output the string
      var i = 0;
      function typeLoop () {
        if(settings.lifeLike === true){
          delayTime = typeSpeed*Math.random();
        }
        setTimeout(function () {
          theElement.append(characterArray[i]);
          i++;
          if (i < characterArray.length) {
            typeLoop();
          }
        }, delayTime);
      }
      typeLoop();
    }

  };

 }(jQuery));
