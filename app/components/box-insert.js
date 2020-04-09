import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class BoxInsertComponent extends Component {

  showSpecialCount = false;

  get sideShowSet() {
    return this.args.printOptions.get('side_showSet');
  }

  get deck() {
    return this.args.deck;
  }

  get type() {
    return this.args.insertType.id;
  }

  get housesRatioBarData() {
    return [this.args.deck.house1SAS, this.args.deck.house2SAS, this.args.deck.house3SAS];
  }

  get deckLoaded() {
    return this.args.deck.name !== undefined;
  }

}