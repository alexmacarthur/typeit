function setHeaderSize() {
  var windowHeight = $( window ).height();
  var header = $('#header');
  header.height(windowHeight);
}

setHeaderSize();
$( window ).resize(function() {
  setHeaderSize();
});

$('#typeit-box').typeIt({
  strings: ['A jQuery plugin that <strong class="emphasized">types</strong> stuff for you.'],
  speed: 75,
  breakLines: false,
  breakDelay: 1000
});

var $example1 = $('#example1');
var $example2 = $('#example2');
var $example3 = $('#example3');
var $example4 = $('#example4');
var $example5 = $('#example5');
var $example6 = $('#example6');

function example4() {
  $example4.typeIt({
    strings: ["This is a string!", "And here's another one."],
    speed: 50
  });
}

function example5() {
  $example5.typeIt({
    strings: ["This is a great string.","But here is a better one."],
    speed: 50,
    breakLines: false
  });
}

function example6() {
  $example6.typeIt({
    strings: ["Card games are <span class='just-a-class'>great!</span> &spades; &hearts; &clubs; &diams;"],
    speed: 50
  });
}

$('section').on('click','#btn-example6', function() {
  if ($example6.data('typeit') !== undefined) {
    clearTimeout($example6.data('typeit').tTO);
    clearTimeout($example6.data('typeit').dTO);
  }
  $example6.html('');
  example6();
});

$('section').on('click','#btn-example5',function() {
  if ($example5.data('typeit') !== undefined) {
    clearTimeout($example5.data('typeit').tTO);
    clearTimeout($example5.data('typeit').dTO);
  }
  $example5.html('');
  example5();
});

$('section').on('click','#btn-example4',function() {
  if ($example4.data('typeit') !== undefined) {
    clearTimeout($example4.data('typeit').tTO);
    clearTimeout($example4.data('typeit').dTO);
  }
  $example4.html('');
  example4();
});

example4();
example5();
example6();

(function() {

  $('#iSpeed').val('100');
  $('#iBreakDelay').val('750');
  $('#iCursorSpeed').val('1000');
  $('#iStartDelay').val('250');
  $('#iLoopDelay').val('750');

  $('#TIInput').on('click','#TISubmit', function(e){

    e.preventDefault();

    var tiOutput = $('#TIOutput');
    var curData = tiOutput.data('typeit');

    // if there's another process going on, stop it and wipe the output box
    if(curData !== undefined) {
      clearTimeout(curData.tTO);
      clearTimeout(curData.dTO);
      curData.s.loop = false;
      tiOutput.removeData();
    }

    tiOutput.html('');

    // get variables figured out
    var strings;
    var cleanedstrings = [];
    if($('#stringTI').val() === '') {
      cleanedstrings = 'You didn\'t enter a string!';
    } else {
      strings = $('#stringTI').val().split('\n');
      // remove empty array item
      for (var i = 0; i < strings.length; i++) {
        if (strings[i] !== undefined && strings[i] !== null && strings[i] !== "") {
          cleanedstrings.push(strings[i]);
        }
      }
    }

    var newHeight = ($('#stringTI').val()) ? (cleanedstrings.length * 38) + 40 : 75;
    var speed = $('#iSpeed').val();
    var html = $('#iHTML').val() === 'true' ? true : false;
    var lifeLike = $('#iLifeLike').val() === 'true' ? true : false;
    var cursor = $('#iCursor').val() === 'true' ? true : false;
    var cursorSpeed = $('#iCursorSpeed').val();
    var breakLines = $('#iBreakLines').val() === 'true' ? true : false;
    var breakDelay = $('#iBreakDelay').val();
    var breakStart = $('#iBreakStart').val();
    var startDelay = $('#iStartDelay').val();
    var loop = $('#iLoop').val() === 'true' ? true : false;
    var loopDelay = $('#iLoopDelay').val();

    // hide the temp text
    $('#tempText').animate({
      opacity: 0
    });

    // expand the container
    $('#TIOutputBox').animate({
      height: newHeight
    }, function() {

      $('html, body').animate({
          scrollTop: $("#TIOutputBox").offset().top - 200
      }, 800);

      setTimeout(function() {

        tiOutput.typeIt({
            strings: cleanedstrings,
            speed: Number(speed),
            lifeLike: lifeLike,
            cursor: cursor,
            cursorSpeed: Number(cursorSpeed),
            breakLines: breakLines,
            breakDelay: Number(breakDelay),
            startDelay: Number(startDelay),
            loop: loop,
            loopDelay: Number(loopDelay),
            html: html
          });
      }, 800);

    });

  });

})();

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
