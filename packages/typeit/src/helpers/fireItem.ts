import { CURSOR_CLASS, CURSOR_WRAPPER_CLASS } from "../constants";
import { El, QueueItem, QueueMapPair } from "../types";
import beforePaint from "./beforePaint";
import { walkElementNodes } from "./chunkStrings";
import createElement from "./createElement";
import createTextNode from "./createTextNode";
import removeNode from "./removeNode";
import select from "./select";

let execute = (queueItem: QueueItem) => queueItem.func?.call(this);

let destroyCursorrWrapper = (element) => {
    let wrapper = element.querySelector(`.${CURSOR_WRAPPER_CLASS}`);

    if (wrapper) {
      walkElementNodes(wrapper, false, true).forEach((n) => {
        wrapper.before(n);
      });

      removeNode(wrapper);
    }
}

let createCursorWrapper = () => {
  let cursor = select(`.${CURSOR_CLASS}`) as El;

  // Maybe wrap the cursor next to its previous sibling
  // to avoid line-break and cursor alignment issues.
  if (cursor.nextSibling && cursor.previousSibling) {
    let placeholder = createTextNode("");

    cursor.previousSibling.before(placeholder);

    let wrapper = createElement("span");
    wrapper.classList.add(CURSOR_WRAPPER_CLASS);
    wrapper.append(cursor.previousSibling, cursor);

    placeholder.replaceWith(wrapper);
  }
}

let fireItem = async (
  index: number,
  queueItems: QueueMapPair[],
  wait, 
  element
): Promise<number> => {
  let queueItem = queueItems[index][1];
  let instantQueue = [];
  let tempIndex = index;
  let futureItem = queueItem;
  let shouldBeGrouped = () => futureItem && !futureItem.delay;

  destroyCursorrWrapper(element);

  // Crawl through the queue and group together all items that
  // do not have have a delay and can be executed instantly.
  while (shouldBeGrouped()) {
    instantQueue.push(futureItem);

    shouldBeGrouped() && tempIndex++;
    futureItem = queueItems[tempIndex] ? queueItems[tempIndex][1] : null;
  }

  if (instantQueue.length) {
    // All are executed together before the browser has a chance to repaint.
    await beforePaint(async () => {
      for (let q of instantQueue) {
        await execute(q);
      }
    });

    // Important! Because we moved into the future, the index
    // needs to be modified and returned for accurate remaining execution.
    return tempIndex - 1;
  }

  await wait(() => beforePaint(() => execute(queueItem)), queueItem.delay);

  createCursorWrapper();

  return index;
};

export default fireItem;
