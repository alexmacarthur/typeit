if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, "startsWith", {
    value: function(search) {
      return this.indexOf(search) === 0;
    },
    configurable: true,
    writable: true
  });
}
