import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { HouseList } from 'burger-inserts/data/keyforge-data';

export default class HousePickerComponent extends Component {
  
  @tracked selection = [];

  get houseList() {
    return HouseList;
  }

  @action
  setHouses(houses) {
    if(houses.length > 3){
      // Only keep the last 3
      houses = houses.slice(houses.length - 3, houses.length);
    }
    
    if(this.args.onChange) {
      this.args.onChange(houses);
    }
    this.selection = houses;
  }
}