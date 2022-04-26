import TypeIt from "../src";

new TypeIt("#example1", {
  speed: 50,
  startDelay: 900
})
  .type("the mot versti", {delay: 100})
  .move(".a.a.a")
  // .move(-8, {delay: 100})
  // .type('s', {delay: 400})
  // .move(null, {to: 'START', instant: true, delay: 300})
  // .move(1, {delay: 200})
  // .delete(1)
  // .type('T', {delay: 225})
  // .pause(200)
  // .move(2, {instant: true})
  // .pause(200)
  // .move(5, {instant: true})
  // .move(5, {delay: 200})
  // .type('a', {delay: 350})
  // .move(null, {to: 'END'})
  // .type('le typing utlity')
  // .move(-4, {delay: 150})
  // .type('i')
  // .move(null, {to: 'END'})
  // .type(' on the <span class="place">internet</span>', {delay: 400})
  // .delete('.place', {delay: 800, instant: true})
  // .type('<em><strong class="font-semibold">planet.</strong></em>', {speed: 100})
  .go();
