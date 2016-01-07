# TypeIt: A jQuery Animated Typing Plugin

## Description
A jQuery plugin that outputs text like it's being typed. It allows you to type single strings, multiple strings that stack, multiple strings that delete & replace each other, and even text wrapped in HTML tags (including custom classes, ID's, etc.). You can also loop strings or sets of strings continuously.

## Some of the Perks
* Responsive
* Multiple easy ways to set up/initialize
* Handles HTML tags (including your custom classes, ID's, etc.) with ease. **Note: only supports HTML tags that aren't nested in other tags in the string.**

## Demo
Checkout several demos and a sandbox where you can try it out at <a href="http://macarthur.me/typeit">macarthur.me/typeit</a>.

## Getting Started

### Download the Plugin

Download the ZIP, clone this repo, or install via npm with `npm install typeit`.

### Prepare to Initialize on Your Site

1. Create an empty HTML element to select. (If you want to have a fallback for users without JavaScript, you can put a string right into the element you create. More on that later.)

  ```<span class="type-it"></span>```

2. Load jQuery, typeit.js, and typeit.css in your page.

  ```
  <link rel="stylesheet" type="text/css" href="typeit.css">

  <script src="jquery-2.1.4.min.js"></script>
  <script src="typeit.js"></script>
  ```

You're ready to start typing!

## Usage

### Calling TypeIt on Your Site

You can modify the options for the plugin in two different ways -- either by inserting them directly into the function call, or by using data attributes.

#### About Using Settings Object
* When using a single string, just wrap it in quotation marks. 
* When using multiple strings, place them in an array. Ex: `whatToType: ['String #1','String #2']`

Example:

  ``
   <span class="type-it"></span>
  ``

 ```
  $('.type-it').typeIt({
    whatToType: 'Enter your string here!',
    typeSpeed: 300,
    lifeLike: false,
    showCursor: true
  });
  ```

#### About Using Data Attributes
* Make sure the names are all lowercase. 
* When using multiple strings, wrap your array of strings inside quotation marks. Ex: `data-typeit-whattotype='["string #1", "string #2"]'`

Example:

  ```
  <span class="type-it"
  data-typeit-whattotype="A new string to type."
  data-typeit-typespeed="100"
  data-typeit-lifelike="true"
  data-typeit-showcursor="true">

  </span>
  ```

  ``
  $('.type-it').typeIt();
  ``

You can also define what to type a third way -- by simply filling the element with a string of text. This is convenient because if a user doesn't have JavaScript enabled, they'll still be able to read the text. **Note: by default, the plugin will use the string that's in the element. If strings are defined either in the function call or data attributes, they will be overridden.**

  ```
  <span class="type-it">This is the string that will be typed.</span> 
  ```

### Typing Multiple Strings

Aside from simply typing a single string, you can configure TypeIt to type multiple strings. **Note: while you can define a single string by just putting it in quotation marks, multiple strings must be defined inside an array, like shown below.** By default, they stack on top of each other. To use this feature, just enter an array of several strings.

```
  $('.type-it').typeIt({
    whatToType: ['Enter your string here!', 'Another string!']
  });
```

Or, you can have type strings that delete & replace each other. To do this, set the 'breakLines' setting to `false`.

```
  $('.type-it').typeIt({
    whatToType: ['Enter your string here!', 'Another string!'],
    breakLines: false
  });
```
### Handling HTML Tags
TypeIt will handle HTML tags in your strings, as long as they're only one level deep: 

```
  // GOOD! :)
  $('.typeit-box').typeIt({
    whatToType: '<h1 class="your-class">This is a string!</h1>',
  }
```

```
  // BAD! :(
  $('.typeit-box').typeIt({
    whatToType: '<h1 class="your-class"><span>This is a string!</span></h1>',
  }
```

### Using a Callback Function

TypeIt allows you to use a custom callback function when you've completed typing. To use one, simply add it as the second argument when it's initialized. **Note: if you've enabled `loop`, this is useless.**

```
  $('.typeit-box').typeIt({
    whatToType: 'Here is a string!',
  }, function() {
    console.log('This is your callback function!');
  });
```

## Options

There are a number of options you may use to customize typeIt.

| Option        | Description   | Default Value
| ------------- | ------------- | ------------- |
| whatToType  | The string to be typed.       | 'This is the default string. Replace it with your own.' |
| typeSpeed     | The typing speed.             | 100  |
| lifeLike      | Will make the typing pace irregular, as if a real person is doing it.  | true |
| showCursor    | Show a blinking cursor at the end of the string.  | true  |
| breakLines    | Choose whether you want multiple strings to be printed on top of each other (breakLines = true), or if you want each string to be deleted and replaced by the next one (breakLines = false).  | true  |
| breakDelay    | The amount of time between typing multiple strings.  | 750  |
| startDelay    | The amount of time before the plugin begins typing after initalizing.  | 250  |
| loop    | Have your string or strings continuously loop after completing.  | false  |
| loopDelay    | The amount of time between looping over a string or set of strings again.  | 750  |

## Ideas for Improvement?

Let me know! Otherwise, if you choose to develop it locally, Gulp is configured to check & minify JavaScript and compile & compress SASS. In the root of the repo, use these commands to run these default tasks and watch for file changes (make sure Node.js, npm, and Gulp are installed on your computer):

```
npm install
gulp
```
## Donate

If I've made your life eaiser in some way by creating this thing and want to kick a small "thank you" my way, I'd very much appreciate it! 

PayPal: <a href="http://paypal.me/alexmacarthur">paypal.me/alexmacarthur</a>

Venmo: <a href="https://venmo.com/amacarthur">venmo.com/amacarthur</a>
