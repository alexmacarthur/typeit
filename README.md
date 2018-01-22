# TypeIt
The Most Versatile JavaScript Animated Typing Utility on the Planet

[![Build Status](https://travis-ci.org/alexmacarthur/typeit.svg?branch=master)](https://travis-ci.org/alexmacarthur/typeit)
[![npm downloads](https://img.shields.io/npm/dm/typeit.svg?style=flat-square)](http://npm-stat.com/charts.html?package=typeit)
[![](https://data.jsdelivr.com/v1/package/npm/typeit/badge)](https://www.jsdelivr.com/package/npm/typeit)

## Table of Contents
* [Overview](#overview)
* [Choose a License](#choose-a-license)
* [Usage](#usage)
* [API](#api)
* [Options](#options)
* [CodePen Examples](#codepen-examples)
* [Contribute](#contribute)
* [License](#license)

## Overview
TypeIt is the most versatile JavaScript animated typing utility on the planet. With simple, straightforward configuration, it allows you to type single or multiple strings that break lines, delete & replace each other, and it even handles strings that contain HTML.

For more advanced, controlled typing effects, TypeIt comes with companion functions that can be chained to control your typing down to a single character, enabling you to type an dynamic narrative, with complete control over speed changes, line breaks, deletions, and pauses.

### Key Features
* Choose to start typing only when your container element becomes visible on the screen.
* Loop your string(s) continuously.
* Define you strings via an options object or in the HTML (useful in case user doesn't have JavaScript enabled, as well as for SEO).
* Use a single TypeIt instance to control several different elements on a page.
* Handle HTML tags (including those with classes, ID's, etc.) and entities with ease.
* Use companion functions to chain individual commands together to fine tune your typing.
* Ready to be included via JS module, or as a separate script loaded on your page.
* No dependencies!

### Demos
See some more examples and try out the sandbox [here](https://typeitjs.com).

## Choose a License
Using TypeIt for an open source or personal project is completely free. To use it in a commercial project, purchase a single license, or an unlimited license that'll never expire, no matter how many times you use it.
* Personal or Open Source - [FREE](#setup)
* Single Commercial License - [Purchase Here](https://typeitjs.com#license)
* Extended Commercial License - [Purchase Here](https://typeitjs.com#license)

## Installation

### Get the Code
* <strong><a href="https://www.jsdelivr.com/package/npm/typeit">CDN:</a></strong> Include this on your page: <em>https://cdn.jsdelivr.net/npm/typeit@VERSION_NUMBER/dist/typeit.min.js</em>
* <strong><a href="https://www.npmjs.com/package/typeit">npm / yarn:</a></strong> Install with `npm install typeit` or `yarn install typeit` and import into your project with `import TypeIt from 'typeit'`.
* <strong>Build It Yourself: </strong> If, for some weird reason, you want to clone the repository and build the code yourself, first run `yarn install` and then `yarn run build`. The compiled source files will be in the `/dist` directory.

### Load the Script
Either load it via `script` tag, or import.

```html
<script src="typeit.min.js"></script>
```
  or
```js
import TypeIt from 'typeit';
```

### Create an Element to Be Typed Into
If you want to have a fallback for users without JavaScript, you can put a string or strings right into this element. For more on that, see the [Defining Strings](#defining-strings) section.

```html
<span class="type-it"></span>
```

## Usage
Create a new TypeIt instance, pass a reference to element, and define your [options](#options).

```js
// The simplest example
new TypeIt('.type-it', {
    strings: 'This is my string!'
});
```

### Defining Strings

#### In Your HTML
As a fallback for users without JavaScript, you may define strings in your HTML element.

```html
<span class="type-it">Here is a string.</span>
```

#### Using the type() Method
See more on that in the [Companion Functions](#companion-functions) section.

### Typing Multiple Strings
To define multiple strings, either use `<br>` tag to separate them in your target element, or pass an array into the instance you create.

```html
<span class="type-it">Here is a string. <br>And here is another!</span>
```

```js
new TypeIt('.type-it', {
     strings: ['Enter your string here!', 'Another string!']
});
```

By default, multiple strings will break lines (breakLines: true). However, you can also set them to delete and replace each other.

```js
new TypeIt('.type-it', {
     strings: ['Enter your string here!', 'Another string!'],
     breakLines: false
});
```

## API

#### Handing HTML
TypeIt is fully prepared to handle HTML in your strings, so it's easy to style a portion of what you type, or just do something like bold a couple of words.

##### HTML Elements
Tags must be one level deep and be inline elements.

```js
new TypeIt('.typeit-box', {
     strings: '<h1 class="your-class">This is a string!</h1>',
});
```

##### HTML Entities
ASCII HTML entities must begin with & and end with ;

```js
new TypeIt('.typeit-box', {
    strings: '<h1 class="your-class">I really &hearts; Life cereal.<h1>',
});
```

#### Companion Functions
To control a typewriter effect to the smallest character, pause, speed, or more, there companion functions available. Simply chain them together on an instance of TypeIt, and your chain will execute. You'll be able to create a dynamic, realistic narrative with just a few lines of code.

| Function        | Arguments   | Description
| ------------- | ------------- | ------------- |
| type() | (string) Characters (including those wrapped in HTML) to be typed. | Will type the characters. If instance has already begun, will add the typing action to the end of the queue. |
| delete() | (number) Number of characters to be deleted from what's already been typed. | Will delete the specified number of characters. If left empty, will delete all of what's been typed. |
| empty() | (none) | Will instantly delete everything that has already been typed.
| pause() | (number) Number of milliseconds to pause before continuing. | Will pause the specified number of milliseconds.|
| break() | (none) | Will break the typing to a new line.|
| options() | (JSON) Options you'd like to update | Will redefine your options on the fly. This will only work for updating the `speed`, `lifeLike`, and `html` options.|
| destroy() | (bool) Whether you want to remove the cursor after destroying. Default is `true`.| Destroys the instance on whatever elements to which it's attached.
| freeze() | none | Will pause/freeze an instance.
| unfreeze() | none | Will resume an instance.

#### Chaining on Initializing
You may use these functions to generate a queue of typing events immediately upon creating the instance. This is probably the more common way of using these methods.

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

#### Pausing/Resuming Typing
Additionally, you may use these functions to manipulate an instance after it's been created. A common use case for this is pausing and resuming an instance.

```js
var instance = new TypeIt('#element', {
  strings: "This is what I'm choosing to type right now."
});

//-- Pause after one second.
setTimeout(() => {
  instance.freeze();
}, 1000);

//-- Resume after three seconds.
setTimeout(() => {
  instance.unfreeze();
}, 3000);
```

#### Respond to User Action
This is also helpful if you want your typing to respond to user action of any sort.

```js
var instance = new TypeIt('#element');

document.querySelector('button').addEventListener('click', (event) => {
  instance.type('You just clicked a button!');
});
```

### Tack on Strings Later
You can also use the `type()` function to add more strings onto the queue at a later time. If the instance has already finished, the string will be added to the queue and typed when it's time.

```js
var instance = new TypeIt('#element', {
  strings: "What I'm first going to type."
});

instance.type("I just decided to add this on too, but it won't be typed until the active queue has finished.");
```

### Check If Instance Is Complete
At any moment, you may check if the instance is complete. Access the 'isComplete' property to do so. If `loop` is set to `true`, the instance will never be marked complete.

```js
var instance = new TypeIt('#element', { /* options... */ });

if(instance.isComplete) {
    //-- Do something.
}
```

## Options
You can modify the options for the plugin by passing in JSON upon instantiation.

| Option        | Description   | Default Value
| ------------- | ------------- | ------------- |
| strings  | (string or array) The string(s) to be typed.       | 'Your default string.' |
| speed     | (number in millseconds) The typing speed.             | 100  |
| deleteSpeed     | (number in millseconds) The deletion speed. If left undefined, will be 1/3 of the type speed.           | undefined  |
| lifeLike      | (boolean) Will make the typing pace irregular, as if a real person is doing it.  | true |
| cursor    | (boolean) Show a blinking cursor at the end of the string(s).  | true  |
| cursorSpeed    | (number in milliseconds) The blinking speed of the cursor.  | 1000  |
| cursorChar    | (string) The character used for the cursor. HTML works too! | pipe |
| breakLines    | (boolean) Choose whether you want multiple strings to be printed on top of each other (`breakLines: true`), or if you want each string to be deleted and replaced by the next one (`breakLines: false`).  | true  |
| nextStringDelay    | (number in milliseconds or array) The amount of time (milliseconds) between typing the next string when multiple strings are defined. You may either pass a number in milliseconds, or an array of values. The first value will be used as the delay before a new string starts, and the second value will be used as the delay after a string ends. For example, passing `[1000, 2000]` will tell TypeIt to pause 1000ms before typing a new string, and wait 2000ms after a string has just completed. | 750 |
| startDelete    | (boolean) Whether to begin instance by deleting strings inside element, and then typing what strings are defined via JSON or companion functions. | false  |
| startDelay    | (number in milliseconds) The amount of time before the plugin begins typing after initalizing.  | 250  |
| loop    | (boolean) Have your string or strings continuously loop after completing.  | false  |
| loopDelay    | (number in milliseconds) The amount of time between looping over a string or set of strings again.  | 750  |
| html    | (boolean) Handle strings as HTML, which will process tags and HTML entities. If 'false,' strings will be typed literally.  | true  |
| callback    | (function) A function that executes after your typing has completed. | nuthin' |

#### Changing Option Defaults
If you're creating several instances of TypeIt on a page, and don't wish to repeatedly set an option of the same value for each of them, you can redefine the default options beforehand. Change the default value(s) before creating any instances, and you'll be set.

```js
window.TypeItDefaults.speed = 50;

//-- This and all following instances will now have a default speed of 50.
new TypeIt('#id', {
  strings: 'A string!'
});
```

## CodePen Examples
I have a few CodePen examples that illustrate how to do some interesting things with TypeIt.

* [TypeIt as a React Component](https://codepen.io/alexmacarthur/pen/gXNyBJ)
* [Chained Typing Animations](https://codepen.io/alexmacarthur/pen/MOPQvp)
* ['Fill in the Blank' Effect](https://codepen.io/alexmacarthur/pen/pdXLRG)

## Contribute
Please do! The code is available on Github. Check out the [CONTRIBUTING.md](https://github.com/alexmacarthur/typeit/blob/master/CONTRIBUTING.md) file to see how to get started.

## License
[GPL-2.0](https://github.com/alexmacarthur/typeit/blob/master/LICENSE) © Alex MacArthur
