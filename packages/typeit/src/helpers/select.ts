let select = <T>(
  selector: string,
  element: Node = document,
  all: boolean = false
): T | null => {
  return element[`querySelector${all ? "All" : ""}`](selector);
};

export default select;
