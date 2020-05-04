import Component from '@glimmer/component';

export default class BoxInsertComponent extends Component {

  get deckHasSasData() {
    return !! this.args.deck.lastSasUpdate;
  }

  // Should be renamed other then front
  get houseBarUseColor() {
    return this.args.printOptions.get('front_HouseBarUseColor');
  }
  get showHouseBar() {
    return this.deckHasSasData && this.args.printOptions.get('front_ShowHouseBar');
  }

}