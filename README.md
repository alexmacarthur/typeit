<pre>Update: TypeIt is fully compatible with jQuery 3.2.1+!</pre>

# TypeIt: The Most Versatile jQuery Animated Typing Plugin on the Planet

---

### Table of Contents
- [Overview](#overview)
- [Choose a License](#choose-a-license)
- [Setup](#setup)
- [Simple Usage](#simple-usage)
- [Advanced Usage (Chaining Companion Functions)](#advanced-usage)
- [Options](#options)
- [Contributions](#contributions)
- [Documentation (offsite)](http://macarthur.me/typeit/docs)

---

## Overview

TypeIt is the most versatile, user-friendly jQuery animated typing plugin on the planet. In simple use, it allows you to type single or multiple strings that break lines, delete & replace each other, and it even handles HTML tags &amp; entities. 

For more advanced, controlled typing effects, TypeIt comes with companion functions that can be chained to tweak your typing down to the smallest character, enabling you to type not just a few strings of text, but an entire narrative, with complete control over speed, characters, line breaks, deletions, pauses, everything.

### Some of the Perks
* Choose to start typing only when your element becomes visible on the screen. 
* Loop your string(s) continuously.
* Define you strings via JSON or in the HTML (useful in case user doesn't have JavaScript enabled).
* Create several unique instances on a single page.
* Handle HTML tags (including those with classes, ID's, etc.) and entities with ease.
* Use companion functions to chain individual commands together to fine tune your typing. 
* Supported by jQuery 1.8.0 or higher.
* Lightweight. (~2.2kb, gzipped)

### Demos
Checkout several demos and a sandbox where you can try it out at <a href="http://macarthur.me/typeit">macarthur.me/typeit</a>.

### Documentation
View the full documentation for using TypeIt here: <a href="http://macarthur.me/typeit/docs">macarthur.me/typeit/docs</a>.

## Choose a License
The code is out there to check out and use for any personal project, 100% free. But if you're thinking about using TypeIt commercially, check out the license options below that'll get you full support if it's ever needed.
* Personal - [FREE](#setup)
* Single Commercial License - [Purchase Here](http://www.uplabs.com/posts/typeit-a-jquery-animated-typing-plugin)
* Extended Commercial License - [Purchase Here](http://www.uplabs.com/posts/typeit-a-jquery-animated-typing-plugin)

## Setup

### Get the Code

Get it from this repo, or from the following sources: 

* <strong><a href="https://www.jsdelivr.com/projects/jquery.typeit">CDN:</a></strong> Include  `https://cdn.jsdelivr.net/npm/typeit@4.4.1/dist/typeit.min.js` or `https://cdnjs.cloudflare.com/ajax/libs/typeit/4.4.1/typeit.min.js` on your page.
* <strong><a href="https://www.npmjs.com/package/typeit">npm:</a></strong> Install with `npm install typeit`.

### Hook It Up

1. Load jQuery and typeit.js on your page.

  ```html
  <script src="jquery.js"></script>
  <script src="typeit.js"></script>
  ```
  
2. Create an empty HTML element to select. (If you want to have a fallback for users without JavaScript, you can put a string or strings right into this element. For more on that, see the <a href="http://macarthur.me/typeit/docs">full documentation</a>.)

  ```html
  <span class="type-it"></span>
  ```

You're ready to start typing!

## Simple Usage

In it's simplest use, just call `typeIt()` on any element and include your [options](#options).

Example: 

```js
  $('.type-it').typeIt({
    strings: ['Enter your string here!', 'Another string!']
  });
```

## Advanced Usage
To control your typing down to the smallest character, there are five companion functions available to use. Simply chain them together following a typeIt() call on an element, and your chain will execute. You can define your global settings within the function call like usual, and can even change settings on the fly throughout the chain. 

For example:

```js
  $('.type-it').typeIt({
    speed: 900,
    lifeLike: false,
    autoStart: false
  })
  .tiType('I am typing slowly,')
  .tiSettings({speed: 100})
  .tiType('but now I am typing pretty fasst')
  .tiDelete(2)
  .tiType('t!');
```

### Companion Functions

| Function        | Arguments   | Description
| ------------- | ------------- | ------------- |
| tiType() | (string) Characters (including those wrapped in HTML) to be typed. | Will type the characters. |
| tiDelete() | (number) Number of characters to be deleted from what's already been typed. | Will delete the specified number of characters. |
| tiEmpty() | (none) | Will instantly delete everything that has already been typed.
| tiPause() | (number) Number of milliseconds to pause before continuing. | Will pause the specified number of milliseconds.|
| tiBreak() | (none) | Will break the typing to a new line.|
| tiSettings() | (JSON) Options you'd like to update | Will redefine your options on the fly. This will only work for updating the `speed`, `lifeLike`, and `html` options.|



## Options

You can modify the options for the plugin by passing in JSON. 

There are a number of options you may use to customize TypeIt. For more details on these options, view the <a href="http://macarthur.me/typeit/docs">full documentation</a>.

| Option        | Description   | Default Value
| ------------- | ------------- | ------------- |
| strings  | (string or array) The string(s) to be typed.       | 'Your default string.' |
| speed     | (number in millseconds) The typing speed.             | 100  |
| deleteSpeed     | (number in millseconds) The deletion speed. If left undefined, will be 1/3 of the type speed.           | undefined  |
| lifeLike      | (boolean) Will make the typing pace irregular, as if a real person is doing it.  | true |
| cursor    | (boolean) Show a blinking cursor at the end of the string(s).  | true  |
| cursorSpeed    | (number in milliseconds) The blinking speed of the cursor.  | 1000  |
| breakLines    | (boolean) Choose whether you want multiple strings to be printed on top of each other (`breakLines: true`), or if you want each string to be deleted and replaced by the next one (`breakLines: false`).  | true  |
| breakDelay    | (number in milliseconds) The amount of time (milliseconds) between line breaks when typing multiple strings. Only effective when `breakLines: true`.  | 750  |
| deleteDelay    | (number in milliseconds) The amount of time (milliseconds) between deleting the current string and typing the next. Only effective when `breakLines: false`.  | 750  |
| startDelete    | (boolean) Whether to begin instance by deleting strings inside element, and then typing what strings are defined via JSON or companion functions. | false  |
| startDelay    | (number in milliseconds) The amount of time before the plugin begins typing after initalizing.  | 250  |
| loop    | (boolean) Have your string or strings continuously loop after completing.  | false  |
| loopDelay    | (number in milliseconds) The amount of time between looping over a string or set of strings again.  | 750  |
| html    | (boolean) Handle strings as HTML, which will process tags and HTML entities. If 'false,' strings will be typed literally.  | true  |
| callback    | (function) A function that executes after your typing has completed. | nuthin' |

## Contributions

This project is setup with Gulp to lint & minify the JavaScript. In the root of the repo, use these commands to run these default tasks and watch for file changes (make sure Node.js, npm, and Gulp are installed on your computer):

```
npm install
gulp
```
## Donations

If I've made your life eaiser in some way by creating this thing and want to kick a small "thank you" my way, I'd very much appreciate it! 

PayPal: <a href="http://paypal.me/alexmacarthur">paypal.me/alexmacarthur</a>

Venmo: <a href="https://venmo.com/amacarthur">venmo.com/amacarthur</a>
