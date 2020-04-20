import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | deck-folder', function(hooks) {
  setupRenderingTest(hooks);

  test('Show folder name and count', async function(assert) {
    this.set('folder', {name:'DeckName', count:42});

    await render(hbs`<DeckFolder @folder={{folder}} />`);

    assert.equal(this.element.textContent.trim(), 'DeckName (42)');
  });
});
