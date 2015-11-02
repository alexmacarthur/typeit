$('.typeit-box').typeIt({
  whatToType: ['A jQuery plugin that types stuff for you.'],
  typeSpeed: 100
});

$('.example1').typeIt({
  whatToType: "You've just initialized this bad boy.",
  typeSpeed: 100
});

$('section').on('click','.btn-example1',function() {
  $('.example1').data().typeit.stopTyping();
  $('.example1').html('');
  $('.example1').typeIt({
    whatToType: "You've just initialized this bad boy.",
    typeSpeed: 100
  });
});

$('.example2').typeIt();

$('section').on('click','.btn-example2',function() {
  $('.example2').data().typeit.stopTyping();
  $('.example2').html('');
  $('.example2').typeIt();
});

$('.example3').typeIt({
  whatToType: ["This is a string!", "And here's another one."],
  typeSpeed: 100
});

$('section').on('click','.btn-example3',function() {
  $('.example3').data().typeit.stopTyping();
  $('.example3').html('');
  $('.example3').typeIt({
    whatToType: ["This is a string!", "And here's another one."],
    typeSpeed: 100
  });
});

$('.example4').typeIt({
  whatToType: ["This is a great string.", "But here is a better one."],
  typeSpeed: 100,
  breakLines: false
});

$('section').on('click','.btn-example4',function() {
  $('.example4').data().typeit.stopTyping();
  $('.example4').html('');
  $('.example4').typeIt({
    whatToType: ["This is a great string.", "But here is a better one."],
    typeSpeed: 100,
    breakLines: false
  });
});

(function() {

  $('#iTypeSpeed').val('250');
  $('#iBreakWait').val('500');
  $('#iDelayStart').val('250');

  $('#TIInput').on('click','#TISubmit', function(e){

    e.preventDefault();

    // if there's another process going on, stop it and wipe the output box
    if($.hasData($(this))) {
      $(this).data().typeit.stopTyping();
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
    var breakWait = $('#iBreakWait').val();
    var breakStart = $('#iBreakStart').val();
    var delayStart = $('#iDelayStart').val();

    // hide the temp text
    $('.temp-text').animate({
      opacity: 0
    });

    // expand the container
    $('.ti-output-box').animate({
      height: newHeight
    }, function() {

      $('html, body').animate({
          scrollTop: $(".ti-output-box").offset().top - 200
      }, 800);

      setTimeout(function() {
        $('#TIOutput').typeIt({
            whatToType: cleanedWhatToType,
            typeSpeed: typeSpeed,
            lifeLike: lifeLike,
            showCursor: showCursor,
            breakLines: breakLines,
            breakWait: breakWait,
            breakStart: breakStart,
            delayStart: delayStart
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
