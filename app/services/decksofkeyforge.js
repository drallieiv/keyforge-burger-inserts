import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'burger-inserts/config/environment';
import moment from 'moment';
import { schedule } from '@ember/runloop';

export default class DecksofkeyforgeService extends Service {
  @service ajax;
  
  apiKey;

  apiBasePath = 'https://decksofkeyforge.com/public-api/v3/';

  updateQueue = [];

  constructor() {
    super(...arguments);
    // By default use shared API Key
    this.set('apiKey', ENV.dok.sharedApiKey);

    // Start call loop
    let decksLoopPeriod = 2000;
    setInterval(this.ticketsQueueLoop.bind(this), decksLoopPeriod);
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
    if(this.updateQueue.lengh == 0) {
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
      ticket.reject(error);
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
