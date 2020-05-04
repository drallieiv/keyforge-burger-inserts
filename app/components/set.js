import Component from '@glimmer/component';
import { CardSets } from 'burger-inserts/data/keyforge-data';

export default class SetComponent extends Component {

  baseIconPath = 'assets/icons/';

  get short() {
    if(!CardSets[this.args.set]) {
      return '?';
    }
    return CardSets[this.args.set].short;
  }

  get colorStyle() {
    if(!this.args.printOptions.get('showSetColor') || !CardSets[this.args.set]){
      return '';
    }
    return CardSets[this.args.set].class;
  }
}