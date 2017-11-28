<pre>Update: TypeIt is now vanilla JavaScript, and no longer dependent upon jQuery!</pre>

# TypeIt: The Most Versatile JavaScript Animated Typing Utility on the Planet

### Table of Contents
- [Overview](#overview)
- [Choose a License](#choose-a-license)
- [Setup](#setup)
- [Simple Usage](#simple-usage)
- [Advanced Usage (Chaining Companion Functions)](#advanced-usage)
- [Options](#options)
- [Contributions](#contributions)
- [Documentation (offsite)](https://typeitjs.com/docs)

---

## Overview

TypeIt is the most versatile JavaScript animated typing utility on the planet. With simple, straightforward configuration, it allows you to type single or multiple strings that break lines, delete & replace each other, and it even handles strings that contain HTML.

For more advanced, controlled typing effects, TypeIt comes with companion functions that can be chained to control your typing down to a single character, enabling you to type an dynamic narrative, with complete control over speed changes, line breaks, deletions, and pauses. 

### Some of the Perks
* Choose to start typing only when your container element becomes visible on the screen. 
* Loop your string(s) continuously.
* Define you strings via an options object or in the HTML (useful in case user doesn't have JavaScript enabled, as well as for SEO).
* Use a single TypeIt instance to control several different elements on a page.
* Handle HTML tags (including those with classes, ID's, etc.) and entities with ease.
* Use companion functions to chain individual commands together to fine tune your typing. 
* Ready to be included via JS module, or as a separate script loaded on your page.
* No dependencies!

### Demos
Checkout several demos and a sandbox where you can try it out at <a href="https://typeitjs.com">typeitjs.com</a>.

### Documentation
View the full documentation for using TypeIt here: <a href="https://typeitjs.com/docs">typeitjs.com/docs</a>.

## Choose a License
Using TypeIt for an open source or personal project is completely free. To use it in a commercial project, purchase a single license, or an unlimited license that'll never expire, no matter how many times you use it. 
* Personal or Open Source - [FREE](#setup)
* Single Commercial License - [Purchase Here](https://www.uplabs.com/posts/typeit-a-jquery-animated-typing-plugin)
* Extended Commercial License - [Purchase Here](https://www.uplabs.com/posts/typeit-a-jquery-animated-typing-plugin)

## Setup

### Get the Code

Get it from this repo, or from the following sources: 

* <strong><a href="https://cdnjs.com/libraries/typeit">CDN:</a></strong> Include `https://cdnjs.cloudflare.com/ajax/libs/typeit/{ VERSION }/typeit.min.js` on your page.
* <strong><a href="https://www.npmjs.com/package/typeit">npm / yarn:</a></strong> Install with `npm install typeit` or `yarn install typeit` and import into your project with `import TypeIt from 'typeit'`.

### Hook It Up

1. Load TypeIt into your page or application.

  ```html
  <script src="typeit.js"></script>
  ```
  or
  ```js
  import TypeIt from 'typeit'; 
  ```

2. Create an empty HTML element to select. (If you want to have a fallback for users without JavaScript, you can put a string or strings right into this element. For more on that, see the <a href="https://typeitjs.com/docs">full documentation</a>.)

  ```html
  <span class="type-it"></span>
  ```

You're ready to start typing!

## Simple Usage

At its simplest use, just create a new TypeIt instance, pass an empty element, and define your [options](#options).

Example: 

```js
  new TypeIt('.type-it', {
    strings: ['Enter your string here!', 'Another string!']
  });
```

## Advanced Usage
To control a typewriter effect to the smallest character, pause, speed, or more, there are six companion functions available. Simply chain them together on an instance of TypeIt, and your chain will execute. You'll be able to create a dynamic, realistic narrative with just a few lines of code.

For example:

```js
  new TypeIt('.type-it', {
    speed: 900,
    lifeLike: false,
    autoStart: false
  })
  .type('I am typing slowly,')
  .options({speed: 100})
  .type('but now I am typing pretty fasst')
  .delete(2)
  .type('t!');
```

### Companion Functions

| Function        | Arguments   | Description
| ------------- | ------------- | ------------- |
| type() | (string) Characters (including those wrapped in HTML) to be typed. | Will type the characters. |
| delete() | (number) Number of characters to be deleted from what's already been typed. | Will delete the specified number of characters. |
| empty() | (none) | Will instantly delete everything that has already been typed.
| pause() | (number) Number of milliseconds to pause before continuing. | Will pause the specified number of milliseconds.|
| break() | (none) | Will break the typing to a new line.|
| options() | (JSON) Options you'd like to update | Will redefine your options on the fly. This will only work for updating the `speed`, `lifeLike`, and `html` options.|

## Options

You can modify the options for the plugin by passing in JSON. 

There are a number of options you may use to customize TypeIt. For more details on these options, view the <a href="https://typeitjs.com/docs">full documentation</a>.

| Option        | Description   | Default Value
| ------------- | ------------- | ------------- |
| strings  | (string or array) The string(s) to be typed.       | 'Your default string.' |
| speed     | (number in millseconds) The typing speed.             | 100  |
| deleteSpeed     | (number in millseconds) The deletion speed. If left undefined, will be 1/3 of the type speed.           | undefined  |
| lifeLike      | (boolean) Will make the typing pace irregular, as if a real person is doing it.  | true |
| cursor    | (boolean) Show a blinking cursor at the end of the string(s).  | true  |
| cursorSpeed    | (number in milliseconds) The blinking speed of the cursor.  | 1000  |
| breakLines    | (boolean) Choose whether you want multiple strings to be printed on top of each other (`breakLines: true`), or if you want each string to be deleted and replaced by the next one (`breakLines: false`).  | true  |
| nextStringDelay    | (number in milliseconds) The amount of time (milliseconds) between typing the next string when multiple strings are defined.  | 750  |
| startDelete    | (boolean) Whether to begin instance by deleting strings inside element, and then typing what strings are defined via JSON or companion functions. | false  |
| startDelay    | (number in milliseconds) The amount of time before the plugin begins typing after initalizing.  | 250  |
| loop    | (boolean) Have your string or strings continuously loop after completing.  | false  |
| loopDelay    | (number in milliseconds) The amount of time between looping over a string or set of strings again.  | 750  |
| html    | (boolean) Handle strings as HTML, which will process tags and HTML entities. If 'false,' strings will be typed literally.  | true  |
| callback    | (function) A function that executes after your typing has completed. | nuthin' |

## Contributions

Please do! The code is available on Github. Spin it up, make a PR, and let's improve TypeIt together!
