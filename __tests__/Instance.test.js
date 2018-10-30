import Instance from "../src/Instance.js";
import { deepStrictEqual } from "assert";

let instance;
let args;

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  args = {
    element: document.getElementById("element"),
    id: "arbitrary-id",
    options: {},
    typeit: null,
    queue: []
  };

  instance = new Instance(args);
});

describe("queueDeletions()", () => {
  test("Queues string length when simple string is passed.", () => {
    instance.queueDeletions("hello");
    expect(instance.queue.waiting).toHaveLength(6);
    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Queues number when number is passed.", () => {
    instance.queueDeletions(6);
    expect(instance.queue.waiting).toHaveLength(7);
    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Queues correct length when HTML is passed.", () => {
    instance.queueDeletions("Some <strong>HTML</strong>.");
    expect(instance.queue.waiting).toHaveLength(11);
    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Queues correct length when multiple HTML tags are passed.", () => {
    instance.queueDeletions("Some <strong>HTML</strong>. And <i>more</i>.");
    expect(instance.queue.waiting).toHaveLength(21);
    expect(instance.queue.waiting).toMatchSnapshot();
  });
});

describe("addSplitPause()", () => {
  test("Inserts split pause around one item.", () => {
    instance = new Instance(
      Object.assign(args, {
        queue: ["a", "b", "c", "d", "e"]
      })
    );

    instance.addSplitPause(2);

    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Inserts split pause around one item.", () => {
    instance = new Instance(
      Object.assign(args, {
        queue: ["a", "b", "c", "d", "e"]
      })
    );

    instance.addSplitPause(2, 2);

    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Inserts split pause around first item.", () => {
    instance = new Instance(
      Object.assign(args, {
        queue: ["a", "b", "c", "d", "e"]
      })
    );

    instance.addSplitPause(0);

    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Inserts split pause around last item.", () => {
    instance = new Instance(
      Object.assign(args, {
        queue: ["a", "b", "c", "d", "e"]
      })
    );

    instance.addSplitPause(4);

    expect(instance.queue.waiting).toMatchSnapshot();
  });
});

describe("maybeNoderize()", () => {
  test("Should return noderized string when setting is enabled.", () => {
    expect(
      instance.maybeNoderize("A <em>fancy</em> string.")
    ).toMatchSnapshot();
  });

  test("Should leave string be, but split it into array when setting is disabled.", () => {
    instance = new Instance(
      Object.assign(args, {
        options: {
          html: false
        }
      })
    );

    expect(
      instance.maybeNoderize("A <em>fancy</em> string.")
    ).toMatchSnapshot();
  });
});

describe("loopify()", () => {
  test("Should set correct 'before' delay.", () => {
    instance.loopify({ before: 6000 });

    expect(instance.queue.waiting[0][0].name).toEqual("pause");
    expect(instance.queue.waiting[0][1]).toEqual(6000);
  });

  test("Should queue correct number of deletions.", () => {
    instance.$eContainer.innerHTML = "Just a string.";
    instance.loopify({ before: 2000 });

    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Should queue correct number of deletions when HTML is present.", () => {
    instance.$eContainer.innerHTML = "String with <strong>bold text.</strong>";
    instance.loopify({ before: 2000 });

    expect(instance.queue.waiting).toMatchSnapshot();
  });
});
