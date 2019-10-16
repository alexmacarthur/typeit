import Instance from "../src/Instance.js";

let instance;
let args;

beforeEach(() => {
  setHTML`
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
    expect(instance.queue.waiting).toHaveLength(12);
    expect(instance.queue.waiting).toMatchSnapshot();
  });

  test("Queues correct length when multiple HTML tags are passed.", () => {
    instance.queueDeletions("Some <strong>HTML</strong>. And <i>more</i>.");
    expect(instance.queue.waiting).toHaveLength(23);
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
    instance.$e.innerHTML = "Just a string.";

    instance.$e.innerHTML = setHTML(
      `
      <i class="ti-char">
        J
      </i>
      <i class="ti-char">
        u
      </i>
      <i class="ti-char">
        s
      </i>
      <i class="ti-char">
        t
      </i>
      <i class="ti-char">

      </i>
       <i class="ti-char">
        a
      </i>
      <i class="ti-char">

      </i>
       <i class="ti-char">
        s
      </i>
      <i class="ti-char">
        t
      </i>
      <i class="ti-char">
        r
      </i>
      <i class="ti-char">
        i
      </i>
      <i class="ti-char">
        n
      </i>
      <i class="ti-char">
        g
      </i>
      <i class="ti-char">
        .
      </i>
    `,
      true
    );

    instance.loopify({ before: 2000 });

    expect(instance.queue.waiting).toMatchSnapshot();
  });
});

describe("insert()", () => {
  test("Should insert a simple character correctly.", () => {
    instance.insert("x");
    expect(instance.$e.innerHTML).toBe(`x`);
  });

  test("Should insert a character object.", () => {
    let characterObject = {
      ancestorTree: ["SPAN"],
      attributes: [],
      content: "y",
      isFirstChar: true
    };
    instance.insert(characterObject);

    expect(instance.$e.innerHTML).toBe(`<span>y</span>`);
  });

  test("Should insert a nested character object.", () => {
    let characterObject = {
      ancestorTree: ["SPAN", "EM"],
      attributes: [],
      content: "y",
      isFirstChar: false
    };
    instance.$e.innerHTML = `<em></em>`;
    instance.insert(characterObject);
    expect(instance.$e.innerHTML).toMatchSnapshot();
  });

  test("Should insert content into input.", () => {
    setHTML(`
      <div>
        <input id="inputElement" type="text" />
      </div>
    `);

    Object.assign(args, { element: document.getElementById("inputElement") });

    instance = new Instance(args);

    instance.insert("some value");

    expect(instance.$e.value).toBe("some value");
  });

  test("Should insert raw HTML content into input.", () => {
    setHTML`
      <div>
        <input id="inputElement" type="text" />
      </div>
    `;

    Object.assign(args, { element: document.getElementById("inputElement") });

    instance = new Instance(args);

    instance.insert("<span>sup</span>");

    expect(instance.$e.value).toBe("<span>sup</span>");
  });
});
