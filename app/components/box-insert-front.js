import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class BoxInsertComponent extends Component {

  get frontShowSet() {
    return this.args.printOptions.get('front_showSet');
  }

  get frontShowHeader() {
    return this.args.printOptions.get('front_showHeader');
  }

  get frontShowFooter() {
    return this.args.printOptions.get('front_showFooter');
  }

  get houseBarUseColor() {
    return this.args.printOptions.get('front_HouseBarUseColor');
  }

  get showHouseBar() {
    return this.args.printOptions.get('front_ShowHouseBar');
  }

}