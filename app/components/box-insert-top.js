import Component from '@glimmer/component';

export default class BoxInsertComponent extends Component {
  get houseBarUseColor() {
    return this.args.printOptions.get('front_HouseBarUseColor');
  }
  get showHouseBar() {
    return this.args.printOptions.get('front_ShowHouseBar');
  }
}