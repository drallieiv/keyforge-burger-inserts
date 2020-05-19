import Component from '@glimmer/component';

export default class BoxInsertComponent extends Component {

  get deckHasSasData() {
    return !! this.args.deck.lastSasUpdate;
  }

  get decksHasHouseRatio() {
    return !! this.args.housesRatioBarData;
  }

  // Should be renamed other then front
  get houseBarUseColor() {
    return this.args.printOptions.get('front_HouseBarUseColor');
  }
  get showHouseBar() {
    return this.deckHasSasData && this.decksHasHouseRatio && this.args.printOptions.get('sas_showHouseBar');
  }

  get showSasScore() {
    return this.deckHasSasData && this.args.printOptions.get('sas_showScore');
  }      

}