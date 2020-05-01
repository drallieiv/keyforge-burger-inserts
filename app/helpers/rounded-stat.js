import { helper } from '@ember/component/helper';

export default helper(function roundedStat(params) {
  let [ value ] = params;
  if(value === null || value === undefined) {
    return value;
  }

  let num = value;
  if (typeof num == "string") {
    if(isNaN(num)){ // Handle String
      return num;
    } else {
      num = parseFloat(value);
    } 
  }
  
  return Math.round((num + Number.EPSILON) * 100) / 100
});
