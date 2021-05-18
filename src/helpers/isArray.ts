export default (thing: any[] | string | number): boolean => {
  return Array.isArray(thing);
};
