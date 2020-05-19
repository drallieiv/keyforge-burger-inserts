import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'burger-inserts/config/environment';

export default class DecksofkeyforgeService extends Service {
  @service ajax;
  
  apiKey;

  apiBasePath = 'https://decksofkeyforge.com/public-api/v3/';

  constructor() {
    super(...arguments);
    // By default use shared API Key
    this.set('apiKey', ENV.dok.sharedApiKey);
  }

  _headers(){
    return {
      'Api-Key': this.apiKey
    };
  }

  getDeckStats(deckId) {
    let url = this.apiBasePath + 'decks/' + deckId;
    return this.get('ajax').request(url, {
      headers: this._headers()
    });
  }

  setCustomApiKey(customKey) {
    if(customKey) {
      this.set('apiKey', customKey);
    } else {
      this.set('apiKey', ENV.dok.sharedApiKey);
    }
  }
}
