import Component from '@glimmer/component';

export default class SetComponent extends Component {

  baseIconPath = "assets/icons/";

  setNames = {
    "CALL_OF_THE_ARCHONS": {short: "CotA", class:'set-cota'},
    "AGE_OF_ASCENSION": {short: "AoA", class:'set-aoa'},
    "WORLDS_COLLIDE": {short: "WC", class:'set-wc'},
  };

  get short() {
    if(!this['setNames'][this.args.set]) {
      return '?';
    }
    return this['setNames'][this.args.set].short;
  }

  get colorStyle() {
    if(!this.args.printOptions.get('showSetColor') || !this['setNames'][this.args.set]){
      return '';
    }
    return this['setNames'][this.args.set].class;
  }
}