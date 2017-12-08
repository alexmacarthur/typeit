import Instance from "./instance";

export default class TypeIt {
  constructor(element, args) {
    this.id = this.generateHash();
    this.instances = [];
    this.elements = [];
    this.args = args;

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

    this.createInstances();
  }

  generateHash() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  createInstances() {
    [].slice.call(this.elements).forEach(element => {
      this.instances.push(new Instance(element, this.id, this.args));
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

  destroy(removeCursor = true) {
    this.instances.forEach(instance => {
      instance.timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });

      if (removeCursor) {
        instance.element.removeChild(
          instance.element.querySelector(".ti-cursor")
        );
      }
    });

    this.instances = [];
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
}
