import Component from '@glimmer/component';

export default class BoxInsertComponent extends Component {
  get deck() {
    return this.args.deck;
  }
}