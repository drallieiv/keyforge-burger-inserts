import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | collection/deck-table-line', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    let deck = {
      name: 'deckName',
      expansion: 'WORLDS_COLLIDE',
      houses: ['FirstHouse','SecondHouse','ThirdHouse'],
    };

    this.set('deck', deck);
    await render(hbs`<Collection::DeckTableLine @deck={{deck}}/>`);

    let tableFields = this.element.querySelectorAll('td');
    
    assert.equal(tableFields[0].textContent, 'deckName', 'show deck name');
    assert.equal(tableFields[1].textContent, 'Worlds Collide', 'show expansion full name');
    assert.equal(tableFields[2].textContent, 'First House, Second House, Third House', 'show house names with spacing');
  });
});
