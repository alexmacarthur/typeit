let handleFunctionalArg = <T>(arg: any | (() => T)): T => {
  return typeof arg === "function" ? arg() : arg;
};

export default handleFunctionalArg;
