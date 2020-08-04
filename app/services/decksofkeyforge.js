import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'burger-inserts/config/environment';
import moment from 'moment';

export default class DecksofkeyforgeService extends Service {
  @service ajax;
  
  apiKey;

  apiBasePath = 'https://decksofkeyforge.com/public-api/v3/';

  updateQueue = [];

  nbSkipOnThrottle = 5;
  decksLoopPeriod = 2000;
  throttleCount = 0;

  constructor() {
    super(...arguments);
    // By default use shared API Key
    this.set('apiKey', ENV.dok.sharedApiKey);

    // Start call loop
    setInterval(this.ticketsQueueLoop.bind(this), this.decksLoopPeriod);
  }

  _headers(){
    return {
      'Api-Key': this.apiKey
    };
  }

  getDeckStats(deckId) {
    let deckCallTicket = {deckId: deckId};

    let statsPromise = new Promise(function(resolve, reject) {
      deckCallTicket.resolve = resolve;
      deckCallTicket.reject = reject;
    });

    this.updateQueue.push(deckCallTicket);

    return statsPromise;
  }

  ticketsQueueLoop() {
    if(this.updateQueue.length == 0) {
      return;
    }

    if(this.throttleCount > 0) {
      this.throttleCount--;
      return;
    }

    let ticket = this.updateQueue[0];
    let deckId = ticket.deckId;

    console.debug('process ticket ', ticket);

    let url = this.apiBasePath + 'decks/' + deckId;
    this.get('ajax').request(url, {
      headers: this._headers(),
      async: false,
      statusCode: {
        429: () => {
          this.lastThrottle = moment();
        }
      }
    }).then((data) => {
      this.updateQueue.shift();
      ticket.resolve(data);
    }).catch((error) => {
      console.warn('Call failed', error);
      this.throttleCount = this.nbSkipOnThrottle;
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
