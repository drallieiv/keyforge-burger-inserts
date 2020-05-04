import Component from '@glimmer/component';

export default class DeckTableLineComponent extends Component {
  
  get sortedDecks() {
    return this.args.decks.toArray().sort((a, b) => {
      
      let aHasSas = a.lastSasUpdate === null ? 0 : 1;
      let bHasSas = b.lastSasUpdate === null ? 0 : 1;
      
      // Creation date DESC
      return (aHasSas - bHasSas) || (b.creationDate - a.creationDate);
    });
  }
}