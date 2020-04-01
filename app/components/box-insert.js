import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class BoxInsertComponent extends Component {

  get showSet() {
    return this.args.printOptions.get('side_showSet');
  }

  get deck() {
    return this.args.deck;
  }
}