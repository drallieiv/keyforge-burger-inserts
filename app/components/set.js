import Component from '@glimmer/component';

export default class SetComponent extends Component {

  baseIconPath = "assets/icons/";

  setNames = {
    "CALL_OF_THE_ARCHONS": "CotA",
    "AGE_OF_ASCENSION": "AoA",
    "WORLDS_COLLIDE": "WC",
  };

  get short() {
    return this['setNames'][this.args.set] || "?";
  }
}