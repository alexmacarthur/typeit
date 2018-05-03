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
* [Callback Methods](#callback-methods)
* [CodePen Examples](#codepen-examples)
* [Contribute](#contribute)
* [Need Help?](#need-help)
* [License](#license)

## Overview
TypeIt is the most versatile JavaScript typewriter effect utility on the planet. With simple, straightforward configuration, it allows you to type single or multiple strings that break lines, delete & replace each other, and it even handles strings that contain HTML.

For more advanced, controlled typing effects, TypeIt comes with companion functions that can be chained to control your typing down to a single character, enabling you to type an dynamic narrative, with complete reign over speed changes, line breaks, deletions, and pauses.

### Key Features
* Choose to start typing only when your target element becomes visible on the screen.
* Loop your string(s) continuously.
* Define you strings via an options object or in the HTML (useful in case user doesn't have JavaScript enabled, as well as for SEO).
* Use a single TypeIt instance to target several different elements on a page.
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
* <strong><a href="https://www.npmjs.com/package/typeit">npm / yarn:</a></strong> Install with `npm install typeit` or `yarn add typeit` and import into your project with `import TypeIt from 'typeit'`.
* <strong><a href="https://github.com/alexmacarthur/typeit">Clone the Repo:</a></strong> The compiled source files will be in the `/dist` directory.

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
If you want a fallback for users without JavaScript, you can put a string or strings right into this element. For more on that, see the [Defining Strings](#defining-strings) section.

```html
<span class="type-it"></span>
```

## Usage
Out of the box, a fresh instance of TypeIt accepts three arguments:

* element: The element where text will be typed. This can be a DOM node, or a string reference to an element, class, or ID.
* options: An object that determines how the instance will behave. [More about setting options here.](#options)
* autoInit: A boolean that determines if TypeIt will initialize immediately, or wait until the `.init()` method is called on it later. [More on `autoInit` here.](#creating-an-inactive-instance)

Create a new TypeIt instance, pass a reference to element, and define your [options](#options).

```js
// The simplest example
new TypeIt('.type-it', {
    strings: 'This is my string!'
});
```

### Defining Strings

#### In the Options Object
The most common way to define strings to type is to pass them via the option object's `string` property, either as a string or array of strings.

#### In Your HTML
As a fallback for users without JavaScript, you can define strings in your HTML element.

```html
<span class="type-it">Here is a string.</span>
```

#### Using the type() Method
Or, you can create a base instance, and define your strings using the `type()` method. See more on that in the [Companion Functions](#companion-functions) section.

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

### Handling HTML
TypeIt is fully prepared to handle HTML in your strings, so it's easy to style a portion of what you type, or just do something like bold a couple of words.

#### HTML Elements
Tags must be one level deep and be inline elements.

```js
new TypeIt('.typeit-box', {
     strings: '<h1 class="your-class">This is a string!</h1>',
});
```

#### HTML Entities
ASCII HTML entities must begin with & and end with ;

```js
new TypeIt('.typeit-box', {
    strings: '<h1 class="your-class">I really &hearts; Life cereal.<h1>',
});
```

### Companion Functions
To control a typewriter effect to the smallest character, pause, speed, or more, there companion functions available. Simply chain them together on an instance of TypeIt, and your chain will execute. You'll be able to create a dynamic, realistic narrative with just a few lines of code that looks something like this:

```js
new TypeIt('#element', {
    speed: 50
}).type('I want to type this.').pause(500).type('And type some more!');
```

| Function        | Arguments   | Description
| ------------- | ------------- | ------------- |
| type() | (string) Characters (including those wrapped in HTML) to be typed. | Will type the characters. If instance has already begun, will add the typing action to the end of the queue. |
| delete() | (number) Number of characters to be deleted from what's already been typed. | Will delete the specified number of characters. If left empty, will delete all of what's been typed. |
| empty() | (none) | Will instantly delete everything that has already been typed.
| pause() | (number) Number of milliseconds to pause before continuing. | Will pause the specified number of milliseconds.|
| break() | (none) | Will break the typing to a new line.|
| options() | (JSON) Options you'd like to update | Will redefine your options on the fly. This will only work for updating the `speed`, `lifeLike`, and `html` options.|
| freeze() | none | Will pause/freeze an instance.
| unfreeze() | none | Will resume an instance.
| reset() | none | Will reset an instance back to its starting position, as if nothing ever happened. This method is **not** chainable.
| destroy() | (bool) Whether you want to remove the cursor after destroying. Default is `true`.| Destroys the instance on whatever elements to which it's attached. Destroying an instance will not remove the text itself -- it'll just kill the activity of the instance. This method is **not** chainable.

### Chaining on Initializing
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

### Pausing/Resuming Typing
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

### Respond to User Action
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

### Creating an Inactive Instance
Sometimes, you might want to create an instance, but not trigger it until a later time. To this, set `autoInit` to `false` by passing it as the third argument of your TypeIt instance.

```js
var myInstance = new TypeIt('#element', {
    strings: "This won't start typing automatically."
}, false);

myInstance.init(); //-- Now it's initialized!
```

### Check for Instance States
There are several properties attached to each instance of TypeIt that reveal current states.

#### Is my instance complete?
Use the `isComplete` property:

```js
var instance = new TypeIt('#element', { /* options... */ });

if(instance.isComplete) {
    //-- Do something.
}
```

#### Has my instance been destroyed?
Use the `hasBeenDestroyed` property:

```js
var instance = new TypeIt('#element', { /* options... */ });

if(instance.hasBeenDestroyed) {
    //-- Do something.
}
```

#### Is my instance frozen?
Use the `isFrozen` property:

```js
var instance = new TypeIt('#element', { /* options... */ });

if(instance.isFrozen) {
    //-- Do something.
}
```

#### Has my instance started?
Use the `hasStarted` property.

```js
var instance = new TypeIt('#element', { /* options... */ }, false);

if(!instance.hasStarted) {
    //-- Do something.
}
```

## Options
You can modify the options for the plugin by passing in JSON upon instantiation. It'll look something like this:

```js
new TypeIt('#element', {
    strings: "Your default string.", // or, ["String #1", "String #2"]
    speed: 100
})
```

| Option        | Description   | Default Value
| ------------- | ------------- | ------------- |
| strings  | (string or array) The string(s) to be typed.       | 'Your default string.' |
| speed     | (number in millseconds) The typing speed.             | 100  |
| deleteSpeed     | (number in millseconds) The deletion speed. If left null, will be 1/3 of the type speed.           | null |
| lifeLike      | (boolean) Will make the typing pace irregular, as if a real person is doing it.  | true |
| cursor    | (boolean) Show a blinking cursor at the end of the string(s).  | true  |
| cursorSpeed    | (number in milliseconds) The blinking speed of the cursor.  | 1000  |
| cursorChar    | (string) The character used for the cursor. HTML works too! | pipe |
| breakLines    | (boolean) Choose whether you want multiple strings to be printed on top of each other (`breakLines: true`), or if you want each string to be deleted and replaced by the next one (`breakLines: false`).  | true  |
| nextStringDelay    | (number in milliseconds or array) The amount of time (milliseconds) between typing strings when multiple are defined. You may either pass a number in milliseconds, or an array of values. The first value will be used as the delay before a new string starts, and the second value will be used as the delay after a string has just ended. For example, passing `[1000, 2000]` will tell TypeIt to pause 1000ms before typing a new string, and wait 2000ms after a string has just completed. This would be equivalent to `instance.type('String 1').pause(2000).delete().pause(1000).type('String 2')`. If a number is passed, that value will be halved. | 750 |
| autoStart    | (boolean) Determines if the instance will typing automatically on page load, or only when the target element becomes visible in the viewport. If you don't want instances far down on the page to begin until they're visible, set this option to `false.` | true  |
| startDelete    | (boolean) Whether to begin instance by deleting strings inside element, and then typing what strings are defined via JSON or companion functions. | false  |
| startDelay    | (number in milliseconds) The amount of time before the plugin begins typing after initalizing.  | 250  |
| loop    | (boolean) Have your string or strings continuously loop after completing.  | false  |
| loopDelay    | (number in milliseconds or array) The amount of time between looping over a string or set of strings again. This option behaves identically to `nextStringDelay`. If an array is passed, the first value will be the time before typing begins again (after the set of strings has been deleted), and the second value will be the time immediately after the set of strings has finished typing, before they're deleted to restart. If left undefined, the `nextStringDelay` option will be used. | false |
| html    | (boolean) Handle strings as HTML, which will process tags and HTML entities. If 'false,' strings will be typed literally.  | true  |

#### Changing Option Defaults
If you're creating several instances of TypeIt on a page, and don't wish to repeatedly set an option of the same value for each of them, you can redefine the default options beforehand. Change the default value(s) before creating any instances, and you'll be set.

```js
window.TypeItDefaults.speed = 50;

//-- This and all following instances will now have a default speed of 50.
new TypeIt('#id', {
  strings: 'A string!'
});
```

## Callback Methods
Along all of these options, there are several callback method options you may use to trigger JavaScript at different points in time.

```js
new TypeIt('#id', {
  strings: 'A string!'
  afterString: function(step, queue, instance) {
    //-- Execute your code here.
  }
});
```

### Passed Arguments

Most callback methods will be passed the following arguments.

| Argument | Description
| ------------- | -------------
| step | Each character, deletion, pause, line break, etc. are "steps" in a queue of actions that are run with each instance. Each step is an array with the method that's called, an argument for the method, and a tag if it's the first or last character in a string that's been queued to be typed. So, a typical step will look something like this: `[Function type, 'm']`.
| queue | This is the rest of the queue that is yet to be typed. Each step in the queue is yet to be typed. Any steps that have already been typed will have been removed at this point.
| instance | The instance of TypeIt itself.

### Available Methods
Remember, each of these methods is passed as an option into your instance when you create it:

```js
new TypeIt('#id', {
  afterString: function (step, queue, instance) {},
  afterComplete: function (instance) {}
});
```

| Method | Description | Included Arguments
| ------------- | ------------- | ------------- |
| beforeString()  | Before a new string is about to be typed. For example, if you pass two strings in an array when you set up TypeIt, this callback method will execute twice. | step, queue, instance |
| beforeStep() | Before each step in the queue is executed (including individual pauses, deletions, and new characters). | step, queue, instance
| afterString() | After a string is typed. | step, queue, instance
| afterStep() | After each step in the queue is executed. | step, queue, instance
| afterComplete() | After the entire instance is complete. This runs when all of the steps in the queue have been executed. So, technically, if you let the instance run out of steps and then add new steps later, this method could run more than once. | instance

## CodePen Examples
I have a few CodePen examples that illustrate how to do some interesting things with TypeIt.

* [TypeIt as a React Component](https://codepen.io/alexmacarthur/pen/gXNyBJ)
* [Cute Rainbow Effect Using a Callback Method](https://codepen.io/alexmacarthur/pen/jzybpB)
* [Chained Typing Animations](https://codepen.io/alexmacarthur/pen/MOPQvp)
* ['Fill in the Blank' Effect](https://codepen.io/alexmacarthur/pen/pdXLRG)

## Contribute
Please do! The code is available on Github. Check out the [CONTRIBUTING.md](https://github.com/alexmacarthur/typeit/blob/master/CONTRIBUTING.md) file to see how to get started.

## Need Help?
If you're working with a custom implementation of TypeIt and would like some help, I'm available for hire. [Get in touch!](https://macarthur.me/contact)

## License
[GPL-2.0](https://github.com/alexmacarthur/typeit/blob/master/LICENSE) © Alex MacArthur
