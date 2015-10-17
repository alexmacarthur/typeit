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
     whatToType :['first string','string 2'],
     typeSpeed: 200,
     lifeLike: false,
     showCursor: true,
     breakLines: true,
     breakWait: 500
   },
    typeCount = 0,
    deleteCount = 0,
    stringCount = 0,
    stringPlaceCount = 0,
    shortenedText,
    phraseLength,
    cursor;

   // create the class
   $.fn.typeIt.typeItClass = function(theElement, options){
     var dataDefaults = {
       whatToType : theElement.data('typeitWhattotype'),
       typeSpeed: theElement.data('typeitSpeed'),
       lifeLike: theElement.data('typeitLifelike'),
       showCursor: theElement.data('typeitShowcursor'),
       breakLines: theElement.data('typeitBreaklines'),
       breakWait: theElement.data('typeitBreakWait')
     };
     this.theElement = theElement;
     this.settings = $.extend(defaults, options, dataDefaults);
     this.init(theElement);
   };

   // create a new prototype
   _proto = $.fn.typeIt.typeItClass.prototype;

   // initialize the plugin
   _proto.init = function(theElement){

     var elementHeight = $(theElement).css('font-size');

     this.stringArray = this.settings.whatToType;
     // check if the value is an array or just a string
     if(Object.prototype.toString.call(this.stringArray) !== '[object Array]'){
       // since it's not already an array, turn it into one, since later functionality depends on it being one
       this.stringArray = '["' + this.stringArray + '"]';
       this.stringArray = JSON.parse(this.stringArray);
     }
     this.mergedStrings = this.stringArray.join('');
     this.stringLengths = {};
     phraseLength = this.stringLengths[stringCount];

     // get the string lengths and save to array
     for(j=0; j < this.stringArray.length; j++){
        this.stringLengths[j] = this.stringArray[j].length;
        theElement.append('<span class="ti-container"></span>');
     }

     theElement.css('display','inline-block');

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

      // if settings say so, turn on the blinking cursor
      if(this.settings.showCursor === true && this.mergedStrings[typeCount+stringPlaceCount] != ' '){
        cursor = '<span class="ti-cursor">|</span>';
      } else {
        cursor = '';
      }

      // append the string of letters to the respective .ti-container
      $('.ti-container:nth-child(' + (stringCount + 1) + ')').addClass('active-container').append('<span class="ti-letter">' + this.mergedStrings[typeCount+stringPlaceCount] + cursor + '</span>');

      typeCount++;
      if (typeCount < phraseLength) {
        // type out the string
        this.typeLoop(this.stringLengths[stringCount]);
        // if there are no more characters to print and there is more than one string to be typed, delete the string just printed
      } else if(this.stringArray.length > 1) {
        // update the stringPlaceCount so that we're appending starting at the correct spot in the merged string
        stringPlaceCount = stringPlaceCount + phraseLength;
        // reset typeCount in case this function needs to be reused
        typeCount = 0;
        // if we're not on the last string, then continue to delete, unless the user wants to break lines

        if((stringCount+1 < this.stringArray.length) && this.settings.breakLines === false){
          this.deleteLoop(this.stringLengths[stringCount]);
        // if breakLines is true and we still have strings left to type, break it and continue
        } else if (stringCount+1 < this.stringArray.length && this.settings.breakLines === true){
          stringCount++;

          setTimeout(function(){
            // after slight delay, break line and just blink cursor to show start of new line
            
            // remove any 'active-container' classes fromt the elements
            $('.ti-container').removeClass('active-container');
            // give 'active-container' class to next container, so the cursor can start blinking
            $('.ti-container:nth-child(' + (stringCount + 1) + ')').addClass('active-container').append('<span class="ti-letter">' + cursor + '</span>');

            // after another slight delay, continue typing the next string
            setTimeout(function(){
              this.typeLoop(this.stringLengths[stringCount]);
            }.bind(this), this.settings.breakWait);

          }.bind(this), 1000);

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
