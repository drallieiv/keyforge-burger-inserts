import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionController extends Controller {
  @service ajax;
  
  webcamActive = false;

  flashColor(isValid) {
    if(isValid) {
      this.set('validCodeFound', true);
      Ember.run.later(() => {
        this.set('validCodeFound', false);
      }, 2000);
    } else {
      this.set('invalidCodeFound', true);
      Ember.run.later(() => {
        this.set('invalidCodeFound', false);
      }, 2000);
    }
  }

  /**
   * Check if the deck is registerd on Master Vault
   * @param {string} deckId 
   */
  checkDeckOnVault(deckId) {
    let url = 'https://www.keyforgegame.com/api/decks/codes/'+deckId+'/';
    this.get('ajax').request(url).then((response) => {
      console.log(response);
    });
  }

  @action
  startWebcam() {
    this.set('webcamActive',true);
  }
  
  @action
  onScanSuccess(found)  {
    let exp = 'https://www.keyforgegame.com/deck/([0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5})';
    let match = found.text.match(exp);
    if(match){
      let deckPrivId = match[1];
      console.log('Valid deck scanned : '+deckPrivId);
      this.checkDeckOnVault(deckPrivId);
      this.flashColor(true);
    } else {
      this.flashColor(false);
    }
    this.set('continueScanning', true);
  }

  @action
  onScanError()  {

  }
  @action
  onCamerasFound()  {

  }
  @action
  onCamerasError()  {

  }
}