import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'burger-inserts/config/environment';
import moment from 'moment';

export default class DeckTableLineComponent extends Component {

  @tracked isSasUpdating = false;

  get isMvRegistered() {
    return this.args.deck.masterVaultLink;
  }

  get shouldRefreshSas() {
    return ! this.args.deck.lastSasUpdate || this.args.deck.lastSasUpdate < ENV.dok.lastSasUpdate
  }

  onSasUpdateCallback(result) {
    console.log('Sas update result', result);
    // TODO more check
    this.isSasUpdating = false;
  }

  autoSasImport(element, options) {
    let [ deck, updateSas] = options;
    // Check if scanned deck
    if(deck.masterVaultLink) {
      let secSinceAdded = moment().diff(deck.creationDate, 'seconds');
      if(secSinceAdded < 5) {
        updateSas(deck);
      }
    }
  }
  
  @action
  updateSas(deck) {
    if(this.args.updateSas) {
      this.isSasUpdating = true;
      this.args.updateSas(deck, this.onSasUpdateCallback.bind(this));
    }    
  }
}