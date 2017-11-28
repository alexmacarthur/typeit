const Instance = require("./instance").default;

module.exports = class TypeIt {
  constructor(element, options) {
    this.elements = [];
    this.instances = [];

    if (typeof element === "object") {
      //-- There's only one!
      if (element.length === undefined) {
        this.elements.push(element);
      } else {
        //-- It's already an array!
        this.elements = element;
      }
    }

    //-- Convert to array of elements.
    if (typeof element === "string") {
      this.elements = document.querySelectorAll(element);
    }

    this.createInstances(options);
  }

  createInstances(options) {
    [].slice.call(this.elements).forEach(element => {
      this.instances.push(new Instance(element, options));
    });
  }

  pushAction(func, argument = null) {
    this.instances.forEach(instance => {
      instance.queue.push([instance[func], argument]);
    });
  }

  type(string) {
    this.pushAction("type", string);
    return this;
  }

  delete(numCharacters) {
    this.pushAction("delete", numCharacters);
    return this;
  }

  empty() {
    this.pushAction("empty");
    return this;
  }

  pause(ms) {
    this.pushAction("pause", ms);
    return this;
  }

  break() {
    this.pushAction("break");
    return this;
  }

  options(options) {
    this.pushAction("setOptions", options);
    return this;
  }
};
