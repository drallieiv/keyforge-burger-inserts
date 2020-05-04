import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | collection/deck-table', function(hooks) {
  setupRenderingTest(hooks);

  test('it shows deck with non sas first, by date DESC', async function(assert) {
    
    let decks = [
      {name: 'deck1', lastSasUpdate: null       , creationDate: new Date('2020-05-05T20:01:58.135Z')},
      {name: 'deck4', lastSasUpdate: 'something', creationDate: new Date('2020-05-05T18:01:58.135Z')},
      {name: 'deck3', lastSasUpdate: 'something', creationDate: new Date('2020-05-05T19:01:58.135Z')},
      {name: 'deck2', lastSasUpdate: null       , creationDate: new Date('2020-05-05T17:01:58.135Z')},
    ];

    this.set('decks', decks);

    await render(hbs`
      <Collection::DeckTable @decks={{decks}}/>
    `);

    let deckNamesCells = this.element.querySelectorAll('tbody tr :nth-child(1)');
    let deckNames = [].map.call(deckNamesCells, (td) => td.textContent);
    

    assert.equal(deckNames.join(','), 'deck1,deck2,deck3,deck4', 'decks in order');
    
  });
});
