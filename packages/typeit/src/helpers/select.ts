let select = (
  selector: string,
  element: Node = document,
  all: boolean = false
): Node | NodeList | null => {
  return element[`querySelector${all ? "All" : ""}`](selector);
};

export default select;
