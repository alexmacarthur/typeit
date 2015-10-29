# TypeIt: A jQuery Animated Typing Plugin

## Description
A jQuery plugin that outputs text like it's being typed. It allows you to type single strings, multiple strings that stack, and multiple strings that delete & replace each other. 

## Demo
Checkout several demos and a sandbox where you can try it out at <a href="http://alexmacarthur.github.io/typeit">alexmacarthur.github.io/typeit</a>.

## Setup

### Initializing on Your Site

1. Create an empty HTML element to select.

  ```<span class="type-it"></span>```

2. Load jQuery, typeit.js, and typeit.css in your page.

  ```
  <link rel="stylesheet" type="text/css" href="typeit.css">

  <script src="jquery-2.1.4.min.js"></script>
  <script src="typeit.js"></script>
  ```

You're ready to initialize it! 

## Usage

### Calling TypeIt on Your Site

You can modify the options for the plugin in two different ways -- either by inserting them directly into the function call, or by using data attributes.

  ```
  <span class="type-it"
  data-typeit-whattotype="A new string to type."
  data-typeit-speed="100"
  data-typeit-lifelike="true"
  data-typeit-showcursor="true">

  </span>
  ```

  ``
  $('.type-it').typeit();
  ``

  or...

  ``
   <span class="type-it"></span>
  ``

 ```
  $('.type-it').typeit({
    whatToType:'Enter your string here!',
    typeSpeed: 300,
    lifeLike: false,
    showCursor: true
  });
  ```
  
### Typing Multiple Strings

Aside from simply typing a single string, you can configure TypeIt to type multiple strings. By default, they stack on top of each other. To use this feature, just enter an array of several strings.

```
  $('.type-it').typeit({
    whatToType:['Enter your string here!', 'Another string!']
  });
```
  
Or, you can have type strings that delete & replace each other. Do this, set the 'breakLines' setting to `false`.

```
  $('.type-it').typeit({
    whatToType: ['Enter your string here!', 'Another string!'],
    breakLines: false
  });
```

## Options

There are a number of options you may use to customize typeIt.

| Option        | Description   | Default Value
| ------------- | ------------- | ------------- |
| whatToType  | The string to be typed.       | 'This is the default string. Please replace this string with your own.' |
| typeSpeed     | The typing speed.             | 500  |
| lifeLike      | Will make the typing pace irregular, as if a real person is doing it.  | true |
| showCursor    | Show a blinking cursor at the end of the string.  | true  |
| breakLines    | Choose whether you want multiple strings to be printed on top of eachother (breakLines = true), or if you want each string to be deleted and replaced by the next one (breakLines = false).  | true  |
| breakWait    | The amount of time between typing multiple strings.  | 500  |
| delayStart    | The amount of time before the plugin begins typing after initalizing.  | 100  |

## Ideas for Improvement?

If you choose to develop it locally, Gulp is configured to check & minify JavaScript and compile & compress SASS. In the root of the repo, use these commands to run these default tasks and watch for file changes (make sure Node.js, npm, and Gulp are installed on your computer):

```
npm install
gulp
```
