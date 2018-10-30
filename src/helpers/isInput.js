export default el => {
  return ["textarea", "input"].indexOf(el.tagName.toLowerCase()) > -1;
};
