import Component from '@glimmer/component';

export default class DeckTableLineComponent extends Component {
  get isMvRegistered() {
    return this.args.deck.masterVaultLink;
  }
}