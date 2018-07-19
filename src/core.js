import { generateHash } from "./utilities";
import Instance from "./instance";

export default class Core {
  constructor(element, args, autoInit = true) {
    this.id = generateHash();
    this.instances = [];
    this.elements = [];
    this.args = args;
    this.autoInit = autoInit;

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

    this.generateInstances();
  }

  generateInstances() {
    [].slice.call(this.elements).forEach(element => {
      this.instances.push(
        new Instance(element, this.id, this.args, this.autoInit, this)
      );
    });
  }

  /**
   * Push a specific action into the queue of each instance.
   * If an instance has already completed, trigger the queeu again.
   *
   * @param {string} function
   * @param {*} argument
   */
  queueUp(action, argument = null) {
    this.init(true);

    this.instances.forEach(instance => {
      instance.queue.push([instance[action], argument]);

      if (instance.isComplete === true) {
        instance.next();
      }

      //-- We KNOW we have items to process now, so make sure we set this to false.
      instance.isComplete = false;
    });
  }
}
