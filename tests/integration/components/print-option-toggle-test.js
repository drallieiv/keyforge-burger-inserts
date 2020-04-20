import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | print-option-toggle', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    let id = 'inputId';
    this.set('id', id);
    await render(hbs`<PrintOptionToggle @id={{id}}/>`);

    assert.ok(this.element.querySelectorAll('input#'+id).length > 0);
  });
});
