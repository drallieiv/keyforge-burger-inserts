import Component from '@glimmer/component';
import { CardSets } from 'burger-inserts/data/keyforge-data';
import { htmlSafe } from '@ember/template';

export default class SetComponent extends Component {

  baseIconPath = 'assets/icons/';

  get short() {
    if(!CardSets[this.args.set]) {
      return '?';
    }
    return CardSets[this.args.set].short;
  }

  get showSetColor() {
    return this.setColor != '';
  }

  get setColor() {
    if(!this.args.printOptions.get('showSetColor') || !CardSets[this.args.set]){
      return '';
    }
    return htmlSafe("fill:hsl("+CardSets[this.args.set].hue+",100%,30%)");
  }
}