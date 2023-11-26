export default (el: any) => /<(.+)>(.*?)<\/(.+)>/.test(el.outerHTML);
