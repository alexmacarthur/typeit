let isNonVoidElement = (el) => /<(.+)>(.*?)<\/(.+)>/.test(el.outerHTML);

export default isNonVoidElement;
