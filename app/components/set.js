import Component from '@glimmer/component';

export default class SetComponent extends Component {

  baseIconPath = 'assets/icons/';

  setNames = {
    'CALL_OF_THE_ARCHONS': {short: 'CotA', full: 'Call of the Archons', class:'set-cota'},
    'AGE_OF_ASCENSION': {short: 'AoA', full: 'Age of Ascenscion' ,class:'set-aoa'},
    'WORLDS_COLLIDE': {short: 'WC', full: 'Worlds Collide', class:'set-wc'},
    'MASS_MUTATION': {short: 'MM', full: 'Mass Mutation', class:'set-mm'},
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