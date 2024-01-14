export default (el: HTMLElement): el is HTMLInputElement => {
  return "value" in el;
};
