import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

import PrintOptions from 'burger-inserts/dto/print-options';

class MockPrefService extends Service {

}

module('Integration | Component | set', function(hooks) {

  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:preferences', MockPrefService);
  });
  
  test('it renders', async function(assert) {
    this.set('deckSet', 'CALL_OF_THE_ARCHONS');
    let pref = MockPrefService.create();
    let printOptions = new PrintOptions(pref);
    printOptions.set('showSetColor', true);
    this.set('printOptions', printOptions);

    await render(hbs`<Set @set={{deckSet}} @printOptions={{this.printOptions}}/>`);
    assert.equal(this.element.textContent.trim(), 'CotA');
  });
});
