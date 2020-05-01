import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | roundedStat', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('int show as it is', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{rounded-stat inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1234');
  });

  test('text show as it is', async function(assert) {
    this.set('inputValue', 'text');

    await render(hbs`{{rounded-stat inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'text');
  });

  test('short float as String rounded', async function(assert) {
    this.set('inputValue', '12.5');

    await render(hbs`{{rounded-stat inputValue}}`);

    assert.equal(this.element.textContent.trim(), '12.5');
  });

  test('short float as float rounded', async function(assert) {
    this.set('inputValue', 12.5);

    await render(hbs`{{rounded-stat inputValue}}`);

    assert.equal(this.element.textContent.trim(), '12.5');
  });

  test('long float as String rounded', async function(assert) {
    this.set('inputValue', '12.5123');

    await render(hbs`{{rounded-stat inputValue}}`);

    assert.equal(this.element.textContent.trim(), '12.51');
  });

  test('long float as float rounded', async function(assert) {
    this.set('inputValue', 12.5123);

    await render(hbs`{{rounded-stat inputValue}}`);

    assert.equal(this.element.textContent.trim(), '12.51');
  });
});
