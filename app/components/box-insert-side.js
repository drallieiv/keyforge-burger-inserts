import BoxInsert from './box-insert-common';

export default class BoxInsertSideComponent extends BoxInsert {

  get sideShowSet() {
    return this.args.printOptions.get('side_showSet');
  }

}