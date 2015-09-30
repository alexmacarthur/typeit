/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @copyright 2015 Alex MacArthur
 * @description Types out a given string.
 */

 (function($){

   $.fn.typeIt = function(options){

    // user-defined attribute settings
    var dataSettings = {
      whatToType : this.data('typeitString'),
      typeSpeed: this.data('typeitSpeed'),
      lifeLike: this.data('typeitLifelike'),
      showCursor: this.data('typeitShowcursor')
    };

    // default settings; merge with data attribute settings & function settings
    var settings = $.extend({
       whatToType : ['aaaaa','xxxxx','yyyyy'],
       typeSpeed: 500,
       lifeLike: true,
       showCursor: true
    }, options, dataSettings);

    var theElement = this;

    if(settings.showCursor === true){
      theElement.addClass('ti-cursor');
      theElement.css('position','relative');
    }

    // call function to output text
    typeStuff(settings.whatToType.join(''), settings.lifeLike, settings.typeSpeed, settings.whatToType);

    // the function that types out text
    function typeStuff(string, lifelike, speed, stringArray){

      var i = 0;
      var delayTime = settings.typeSpeed;

      if(stringArray.length > 1){
        var lengths = {};
        for(j=0; j < stringArray.length; j++){
          lengths[j] = stringArray[j].length;
        }
      }

      function typeLoop () {

        if(lifelike === true){
          delayTime = speed*Math.random();
        }
        setTimeout(function () {

          theElement.append(string[i]);

          i++;

          if (i < string.length) {
            typeLoop();
          }
        }, delayTime);
      }
      typeLoop();

      function deleteLoop () {

        var shortenedText;

        setTimeout(function () {

          // get the string from the element and cut it by one character at the end
          shortenedText = theElement.text().substring(0, theElement.text().length - 1);

          // then, put that shortened text into the element so it looks like it's being deleted
          theElement.text(shortenedText);

          i++;
          if (i < string.length) {
            deleteLoop();
          }
        }, delayTime);
      }
      deleteLoop();
    }

  };

 }(jQuery));
