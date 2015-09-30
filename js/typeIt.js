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
       whatToType : ['This is a test string.','Another test.'],
       typeSpeed: 100,
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

      var typeCount = 0
      var deleteCount = 0;
      var stringCount = 0;
      var stringPlaceCount = 0;
      var delayTime = settings.typeSpeed;

      // get the lengths of each array item (strong)
      if(stringArray.length > 1){
        var lengths = {};
        for(j=0; j < stringArray.length; j++){
          lengths[j] = stringArray[j].length;
        }
      }

      function typeLoop (phraseLength) {

        if(lifelike === true){
          delayTime = speed*Math.random();
        }

        setTimeout(function () {
          theElement.append(string[typeCount+stringPlaceCount]);
          typeCount++;
          if (typeCount < phraseLength) {
            // type out the string
            typeLoop(lengths[stringCount]);
          } else if(stringArray.length > 1) {

            // update the stringPlaceCount so that we're appending starting at the correct spot in the merged string
            stringPlaceCount = phraseLength;
            // reset typeCount in case this function needs to be reused
            typeCount = 0;
            // if there are no more characters to print and there is more than one string to be typed, delete the string just printed
            deleteLoop(lengths[stringCount]);
          }
        }, delayTime);

      }

      function deleteLoop (phraseLength) {
        var shortenedText;
        setTimeout(function () {
          // get the string from the element and cut it by one character at the end
          shortenedText = theElement.text().substring(0, theElement.text().length - 1);
          // then, put that shortened text into the element so it looks like it's being deleted
          theElement.text(shortenedText);
          // if there are still characters in the string, run the function again
          deleteCount++;
          if (deleteCount < phraseLength) {
            deleteLoop(phraseLength);
          } else if(stringArray[stringCount+1] != undefined){
            deleteCount = 0;
            stringCount++;
            typeLoop(lengths[stringCount]);
          }
          // make backspacing much smaller by dividing delayTime (arbitrarily) by three
        }, delayTime*.333);
      }

      typeLoop(lengths[stringCount]);

    }

  };

 }(jQuery));
