$('#typeit-box').typeIt({
  whatToType: ['A jQuery plugin that <span class="emphasized">types</span> stuff for you.', '<span class="emphasized emphasized-duh">(Duh.)</span>'],
  typeSpeed: 100,
  breakLines: true,
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
    whatToType: ["This is a string!", "And here's another one."],
    typeSpeed: 100
  });
}

example4();

$('section').on('click','#btn-example4',function() {
  $example4.data('typeit').stop();
  $example4.html('');
  example4();
});

function example5() {
  $example5.typeIt({
    whatToType: ["This is a great string.","But here is a better one."],
    typeSpeed: 100,
    breakLines: false
  });
}

example5();

$('section').on('click','#btn-example5',function() {
  $example5.data('typeit').stop();
  $example5.html('');
  example5();
});

function example6() {
  $example6.typeIt({
    whatToType: ["Here's text <span class='just-a-class'>wrapped in HTML</span>."],
    typeSpeed: 100
  });
}

example6();

$('section').on('click','#btn-example6', function() {
  $example6.data('typeit').stop();
  $example6.html('');
  example6();
});

(function() {

  $('#iTypeSpeed').val('100');
  $('#iBreakDelay').val('750');
  $('#iStartDelay').val('250');
  $('#iLoopDelay').val('750');

  $('#TIInput').on('click','#TISubmit', function(e){

    e.preventDefault();

    // if there's another process going on, stop it and wipe the output box
    if($('#TIOutput').data('typeit') !== undefined) {
      $('#TIOutput').data('typeit').stop();
      $('#TIOutput').removeData();
    }

    $('#TIOutput').html('');

    // get variables figured out
    var whatToType;
    var cleanedWhatToType = [];
    if($('#stringTI').val() === '') {
      cleanedWhatToType = 'You didn\'t enter a string!';
    } else {
      whatToType = $('#stringTI').val().split('\n');
      // remove empty array item
      for (var i = 0; i < whatToType.length; i++) {
        if (whatToType[i] !== undefined && whatToType[i] !== null && whatToType[i] !== "") {
          cleanedWhatToType.push(whatToType[i]);
        }
      }
    }

    var newHeight = ($('#stringTI').val()) ? (cleanedWhatToType.length * 38) + 40 : 75;
    var typeSpeed = $('#iTypeSpeed').val();
    var lifeLike = $('#iLifeLike').val();
      if(lifeLike === 'true'){
        lifeLike = true;
      } else {
        lifeLike = false;
      }
    var showCursor = $('#iShowCursor').val();
      if(showCursor === 'true'){
        showCursor = true;
      } else {
        showCursor = false;
      }
    var breakLines = $('#iBreakLines').val();
      if(breakLines === 'true'){
        breakLines = true;
      } else {
        breakLines = false;
      }
    var breakDelay = $('#iBreakDelay').val();
    var breakStart = $('#iBreakStart').val();
    var startDelay = $('#iStartDelay').val();
    var loop = $('#iLoop').val();
      if(loop === 'true'){
        loop = true;
      } else {
        loop = false;
      }
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

        $('#TIOutput').typeIt({
            whatToType: cleanedWhatToType,
            typeSpeed: Number(typeSpeed),
            lifeLike: lifeLike,
            showCursor: showCursor,
            breakLines: breakLines,
            breakDelay: Number(breakDelay),
            startDelay: Number(startDelay),
            loop: loop,
            loopDelay: Number(loopDelay)
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
