import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { ExpansionList } from 'burger-inserts/data/keyforge-data';

export default class ExpansionPickerComponent extends Component {
  
  @tracked selection = [];

  get expList() {
    return ExpansionList;
  }

  @action
  setExp(expansion) {
    if(this.args.onChange) {
      this.args.onChange(expansion);
    }
    this.selection = expansion;
  }
}