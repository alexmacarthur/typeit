export default (element) => {
  return element.innerHTML.replace(/<\!--.*?-->/g, "").trim();
}
