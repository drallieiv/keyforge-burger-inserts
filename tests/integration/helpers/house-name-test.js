import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | houseName', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders simple house', async function(assert) {
    this.set('name', 'House');
    await render(hbs`{{house-name name}}`);
    assert.equal(this.element.textContent.trim(), 'House');
  });

  test('it renders multiple word house', async function(assert) {
    this.set('name', 'LongHouseName');
    await render(hbs`{{house-name name}}`);
    assert.equal(this.element.textContent.trim(), 'Long House Name');
  });
});
