import { El } from "../types";

let getAnimationFromElement = (element: El): Animation | undefined => {
  return element?.getAnimations().find((animation) => {
    return animation.id === element.dataset.tiAnimationId;
  });
};

export default getAnimationFromElement;
