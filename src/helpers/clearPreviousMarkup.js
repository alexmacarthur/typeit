export default (element, isInput = false) => {
  if (isInput) {
    element.value = "";
    return;
  }

  [].slice.call(element.childNodes).forEach(node => {
    if (node.classList === undefined) return;

    if (node.classList.contains("ti-wrapper")) {
      element.innerHTML = "";
    }
  });
};
