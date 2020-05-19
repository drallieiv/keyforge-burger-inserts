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

  get showSasDataLeft() {
    return this.deckHasSasData && this.args.printOptions.get('front_sas_showStats');
  }

  get showSasDataRight() {
    return this.deckHasSasData && 
    (
      this.args.printOptions.get('front_sas_showStats')
      ||
      this.args.printOptions.get('front_sas_showBasic')
    );
  }

  get showAllSas() {
    return this.deckHasSasData && this.args.printOptions.get('front_sas_showStats');
  }
}