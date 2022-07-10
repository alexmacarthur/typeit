import { El } from "../types";

let isBodyElement = (node: El): boolean => /body/i.test(node?.tagName);

export default isBodyElement;
