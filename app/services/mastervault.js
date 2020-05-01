import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ENV from 'burger-inserts/config/environment';

export default class MastervaultService extends Service {
  @service ajax;

  checkDeckCode(code){
    let url = ENV.kfapi + 'decks/codes/'+code+'/';
    return this.get('ajax').request(url)
  }

  searchDeckByName(name){
    let url = ENV.kfapi + 'decks/?page=1&page_size=10&ordering=-date&search=' + name;
    return this.get('ajax').request(url);
  }
  
}
