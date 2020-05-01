import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | cardSet', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders set full name', async function(assert) {
    this.set('setId', 'AGE_OF_ASCENSION');

    await render(hbs`{{card-set setId 'full'}}`);

    assert.equal(this.element.textContent.trim(), 'Age of Ascenscion');
  });

  test('it renders set default if missing', async function(assert) {
    this.set('setId', 'NEW');

    await render(hbs`{{card-set setId 'full'}}`);

    assert.equal(this.element.textContent.trim(), 'Unknown');
  });
});
