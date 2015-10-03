/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @copyright 2015 Alex MacArthur
 * @description Types out a given string.
 */

 (function($){

   var _proto;

   // the actual jQuery function
   $.fn.typeIt = function(options){
     return this.each(function(){
       var typeItInstance = new $.fn.typeIt.typeItClass($(this), options);
     });
   };

   // plugin default settings
   var defaults = {
     whatToType : ['Hi, my name is Test.','And I am a dad.','one more test.'],
     typeSpeed: 100,
     lifeLike: false,
     showCursor: true
   },
    typeCount = 0,
    deleteCount = 0,
    stringCount = 0,
    stringPlaceCount = 0,
    shortenedText,
    phraseLength;

   // create the class
   $.fn.typeIt.typeItClass = function(theElement, options){
     var dataDefaults = {
      //  whatToType : theElement.data('typeitWhattotype'),
      //  typeSpeed: theElement.data('typeitSpeed'),
      //  lifeLike: theElement.data('typeitLifelike'),
      //  showCursor: theElement.data('typeitShowcursor')
     };
     this.theElement = theElement;
     this.settings = $.extend(defaults, options, dataDefaults);
     this.init(theElement);
   };

   // create a new prototype
   _proto = $.fn.typeIt.typeItClass.prototype;

   // initialize the plugin
   _proto.init = function(theElement){

     this.stringArray = this.settings.whatToType;
     this.mergedStrings = this.stringArray.join('');
     this.stringLengths = {};
     phraseLength = this.stringLengths[stringCount];

     // get the string lengths and save to array
     for(j=0; j < this.stringArray.length; j++){
        this.stringLengths[j] = this.stringArray[j].length;
     }

     // if settings say so, turn on the blinking cursor
     if(this.settings.showCursor === true){
       theElement.addClass('ti-cursor');
       theElement.css('position','relative');
     }

     // start to type the string(s)
     this.typeLoop();

   };

   _proto.typeLoop = function(){

    // set the length of the phrase for this time around
    phraseLength = this.stringLengths[stringCount];

     // make it human-like if specified in the settings
    if(this.settings.lifeLike === true){
      this.delayTime = this.settings.typeSpeed*Math.random();
    } else {
      this.delayTime = this.settings.typeSpeed;
    }

    setTimeout(function () {
      this.theElement.append(this.mergedStrings[typeCount+stringPlaceCount]);
      typeCount++;
      if (typeCount < phraseLength) {
        // type out the string
        this.typeLoop(this.stringLengths[stringCount]);
        // if there are no more characters to print and there is more than one string to be typed, delete the string just printed
      } else if(this.stringArray.length > 1) {
        // update the stringPlaceCount so that we're appending starting at the correct spot in the merged string
        stringPlaceCount = phraseLength;
        // reset typeCount in case this function needs to be reused
        typeCount = 0;
        // if we're not on the last string, then continue to delete.
        if(stringCount+1 < this.stringArray.length){
          this.deleteLoop(this.stringLengths[stringCount]);
        }
      }
    }.bind(this), this.delayTime);

   };

   _proto.deleteLoop = function() {

     setTimeout(function () {
       // get the string from the element and cut it by one character at the end
       shortenedText = this.theElement.text().substring(0, this.theElement.text().length - 1);
       // then, put that shortened text into the element so it looks like it's being deleted
       this.theElement.text(shortenedText);
       // if there are still characters in the string, run the function again
       deleteCount++;
       if (deleteCount < phraseLength) {
         this.deleteLoop(phraseLength);
       } else if(this.stringArray[stringCount+1] !== undefined){
         deleteCount = 0;
         stringCount++;
         this.typeLoop(this.stringLengths[stringCount]);
       }
       // make backspacing much quicker by dividing delayTime (arbitrarily) by three
     }.bind(this), this.delayTime/3);
   };

 }(jQuery));
