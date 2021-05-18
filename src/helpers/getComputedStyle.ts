export default (el): CSSStyleDeclaration => {
  return window.getComputedStyle(el, null);
};
