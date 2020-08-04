import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class DeckTableLineComponent extends Component {
  @service deckManager;
  @tracked isSasUpdating = false;

  get isMvRegistered() {
    return this.args.deck.masterVaultLink;
  }

  get shouldRefreshSas() {
    return this.deckManager.shouldRefreshSas(this.args.deck);
  }

  onSasUpdateCallback(result) {
    console.debug('Sas update result', result);
    this.isSasUpdating = false;
  }

  autoSasImport(element, options) {
    let [ deck, updateSas] = options;
    // Check if scanned deck
    if(deck.masterVaultLink && deck.source !== 'csv') {
      let secSinceAdded = moment().diff(deck.creationDate, 'seconds');
      if(secSinceAdded < 5) { // 5s max
        updateSas(deck);
      }
    }
  }
  
  @action
  updateSas(deck) {
    if(this.args.updateSas) {
      this.isSasUpdating = true;
      return this.args.updateSas(deck, this.onSasUpdateCallback.bind(this));
    }    
  }
}