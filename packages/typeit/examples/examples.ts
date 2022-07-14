import TypeIt from "../src";

new TypeIt("#crazy-cursor", {
  speed: 50,
  strings: ["Look at this thing go!", "Is it not cool?"],
  cursorChar: "⭐",
  cursor: {
    autoPause: false,
    animation: {
      options: {
        duration: 1000,
        easing: "linear",
        direction: "alternate",
      },
      frames: [
        {
          transformOrigin: "0.575em 0.7em",
          transform: "rotate(0deg) scale(1)",
        },
        {
          transformOrigin: "0.575em 0.7em",
          transform: "rotate(360deg) scale(2.5)",
        },
      ],
    },
  },
}).go();

new TypeIt("#example2", {
  speed: 50,
  strings: ["This is my first example.", "It has several strings!"],
  cursor: false,
  startDelay: 3000,
}).go();

new TypeIt("#example3", {
  speed: 50,
  strings: [
    "This is my <strong>second</strong> example.",
    "This should <strong>replace</strong> the second string!",
  ],
  breakLines: false,
}).go();

new TypeIt("#example4", {
  speed: 50,
  strings: ["My first string.", "My second string."],
  loop: true,
}).go();

new TypeIt("#example5", {
  speed: 100,
})
  .type("Here's my first sting.")
  .pause(500)
  .delete(4)
  .pause(500)
  .type("ring.")
  .pause(500)
  .delete()
  .pause(500)
  .options({
    speed: 25,
  })
  .type("And here it is faster!")
  .go();

new TypeIt("#example6", {
  waitUntilVisible: true,
}).go();

new TypeIt("#example7", {
  speed: 50,
  strings: ["<em>Apples & bananas.</em>", "Oats <strong>&amp;</strong> beans."],
  waitUntilVisible: true,
  loop: true,
}).go();

new TypeIt("#example8", {
  speed: 50,
  strings: [
    "<strong id='strong1'>aaa<em id='em1'><i>bbb</i></em></strong>ccc<em id='em2'><strong id='strong2'>ddd</strong></em>",
  ],
  waitUntilVisible: true,
  loop: true,
}).go();

new TypeIt("#example9", {
  speed: 50,
  strings:
    "<strong id='strong1'><strong id='strong2'>Here, two strong tags are nested.</strong></strong>",
  waitUntilVisible: true,
  loop: true,
}).go();

new TypeIt("#example10", {
  speed: 50,
  strings:
    "<strong id='strong1'>This starts strong, and <em class='italic'>then gets italicized </em>before just being strong again.</strong>",
  waitUntilVisible: true,
  loop: true,
}).go();

new TypeIt("#example11", {
  speed: 50,
  waitUntilVisible: true,
  loop: true,
})
  .type("123678")
  .pause(100)
  .move(-3)
  .pause(100)
  .type("45")
  .pause(100)
  .move(3)
  .pause(100)
  .type("9ten!")
  .pause(100)
  .move(-1)
  .pause(100)
  .delete(3)
  .pause(100)
  .type("TEN")
  .move(1)
  .go();

new TypeIt("#example-moving-cursor-with-html", {
  speed: 50,
  strings: ["Hello, <strong style='color: pink;'>Bob!</strong>. <em>Bye!</em>"],
  waitUntilVisible: true,
})
  .move(-8)
  .go();

new TypeIt("#example12", {
  speed: 50,
  waitUntilVisible: true,
  loop: true,
})
  .type("This should...")
  .break()
  .type("break!")
  .go();

new TypeIt("#example13", {
  speed: 50,
  waitUntilVisible: true,
  loop: true,
  afterComplete: function () {
    console.log("DONE!");
  },
})
  .type("Pause after!", { delay: 2000 })
  .break({ delay: 2000 })
  .type("Pause again!", { delay: 2000 })
  .options({ speed: 500, delay: 2000 })
  .type("And again!", { delay: 2000 })
  .exec(
    function () {
      console.log("fire!");
    },
    { delay: 2000 }
  )
  .move(-5, { delay: 2000 })
  .go();

new TypeIt("#instant-actions", {
  speed: 50,
})
  .type("Let's type stuff...", { delay: 500 })
  .type("instantly!", { instant: true, delay: 500 })
  .break({ delay: 500 })
  .type("<em>And</em> delete them instantly too.", { delay: 500 })
  .delete("em", { instant: true })
  .type("And after <strong>that</strong>, move the cursor instantly.", {
    delay: 500,
  })
  .move("strong", { instant: true })
  .go();

const freezeInstance = new TypeIt("#freeze-unfreeze", {
  speed: 50,
  strings: "You should be able to freeze & unfreeze this whenever you want.",
  loop: true,
}).go();

document.querySelector("#freezeButton").addEventListener("click", () => {
  if (freezeInstance.is("frozen")) {
    freezeInstance.unfreeze();
  } else {
    freezeInstance.freeze();
  }
});

new TypeIt("#rainbow-text", {
  speed: 50,
  strings: ["Look, it's rainbow text!"],
  loop: true,
  afterStep: function (instance) {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    instance.getElement().style.color = color;
  },
}).go();

new TypeIt("#form-input", {
  speed: 50,
  waitUntilVisible: true,
  loop: true,
})
  .type("Hi, dude.")
  .delete(5)
  .type("friend.")
  .go();

window.heroInstance = new TypeIt("#hero", {
  speed: 50,
  startDelay: 900,
})
  .type("the mot versti", { delay: 100 })
  .move(-8, { delay: 100 })
  .type("s", { delay: 400 })

  .move(null, { to: "START", instant: false, delay: 300 })
  .move(1, { delay: 200 })
  .delete(1)
  .type("T", { delay: 225 })
  .pause(200)
  .move(2, { instant: true })
  .pause(200)
  .move(5, { instant: true })
  .move(5, { delay: 200 })
  .type("a", { delay: 350 })
  .move(null, { to: "END" })
  .type("le typing utlity")
  .move(-4, { delay: 150 })
  .type("i")
  .move(null, { to: "END" })
  .type(' on the <span class="place">internet</span>', { delay: 400 })
  .delete(".place", { delay: 800, instant: true })
  .type('<em><strong class="font-semibold">planet.</strong></em>', {
    speed: 100,
  })
  .go();

new TypeIt("#non-broken-strings", {
  strings: ["one", "two", "three"],
  breakLines: false,
  loop: true,
}).go();

new TypeIt("#start-delete", {
  strings: ["This is not hard-coded."],
  startDelete: true,
  loop: true,
}).go();
