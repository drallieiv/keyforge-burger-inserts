import BoxInsert from './box-insert-common';

export default class BoxInsertFrontComponent extends BoxInsert {

  get frontShowSet() {
    return this.args.printOptions.get('front_showSet');
  }

  get frontShowHeader() {
    return this.args.printOptions.get('front_showHeader');
  }

  get frontShowFooter() {
    return this.args.printOptions.get('front_showFooter');
  }

}