global.setHTML = (html, shouldReturn = false) => {
  let domString = String.raw({ raw: html })
    .replace(/(\r\n|\n|\r)/gm, "")
    .replace(/>\s+</g, "><");

  if (shouldReturn) {
    return domString;
  }

  document.body.innerHTML = domString;
};

document.fonts = {
  ready: async () => {
    return true;
  },
};

global.expandTextNodes = (element) => {
  [...element.childNodes].forEach((child) => {
    if (child.nodeValue) {
      child.nodeValue.split("").forEach((c) => {
        child.parentNode.insertBefore(document.createTextNode(c), child);
      });

      child.remove();
      return;
    }

    global.expandTextNodes(child);
  });
};

beforeEach(() => {
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => cb());
});
