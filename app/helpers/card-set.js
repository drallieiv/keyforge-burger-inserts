import { helper } from '@ember/component/helper';
import { CardSets } from 'burger-inserts/data/keyforge-data';

export default helper(function cardSet([set, field]) {
  if(CardSets[set] === undefined) {
    return 'Unknown';
  } else{
    return CardSets[set][field] || 'Unknown';
  }
});
