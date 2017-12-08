import TypeIt from '../src/typeit';

test('Returns an object with base properties.', () => {

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {});

  expect(Object.keys(instance).sort()).toEqual(['elements', 'id', 'instances', 'args'].sort());

  document.body.innerHTML = '';
});

test('Destroys instances successfully.', () => {

  jest.useFakeTimers();

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {
    strings: 'This is my string!'
  });

  jest.runAllTimers();

  instance.destroy();

  expect(instance.instances).toHaveLength(0);
  expect(document.body.querySelector('.ti-cursor')).toEqual(null);

  document.body.innerHTML = '';
});
