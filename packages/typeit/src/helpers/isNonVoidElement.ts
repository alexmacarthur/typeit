export default (el) => /<(.+)>(.*?)<\/(.+)>/.test(el.outerHTML);
