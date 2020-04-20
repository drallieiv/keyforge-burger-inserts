import Component from '@glimmer/component';

export default class BoxInsertComponent extends Component {

  get sideShowSet() {
    return this.args.printOptions.get('side_showSet');
  }

}