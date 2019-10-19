/**
 * Given an element, remove any markup left from a previous instance of TypeIt.
 */
export default (element, isInput) => {
  if (isInput) {
    element.value = "";
    return;
  }

  if (element.querySelector(".ti-cursor")) {
    element.innerHTML = "";
  }
};
