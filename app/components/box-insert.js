import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class BoxInsertComponent extends Component {

  showSpecialCount = false;

  get sideShowSet() {
    return this.args.printOptions.get('side_showSet');
  }

  get frontShowSet() {
    return this.args.printOptions.get('front_showSet');
  }

  get frontShowHeader() {
    return this.args.printOptions.get('front_showHeader');
  }

  get frontShowFooter() {
    return this.args.printOptions.get('front_showFooter');
  }

  get deck() {
    return this.args.deck;
  }

  get type() {
    return this.args.insertType.id;
  }


}