import Component from '@glimmer/component';

export default class BoxInsertComponent extends Component {

  showSpecialCount = false;

  get deck() {
    return this.args.deck;
  }

  get type() {
    return this.args.insertType.id;
  }

  get housesRatioBarData() {
    if(this.args.deck.house1SAS == null){
      return null;
    }
    return [parseFloat(this.args.deck.house1SAS), parseFloat(this.args.deck.house2SAS), parseFloat(this.args.deck.house3SAS)];
  }

  get deckLoaded() {
    return this.args.deck !== undefined && this.args.deck.name !== undefined;
  }

}