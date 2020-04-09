import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class BoxInsertComponent extends Component {

  get sideShowSet() {
    return this.args.printOptions.get('side_showSet');
  }

}