import TypeIt from '../src/typeit';

test('Returns an object with base properties.', () => {

  document.body.innerHTML =
    `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt('#element', {});

  expect(Object.keys(instance).sort()).toEqual(['elements', 'instances'].sort());
});
