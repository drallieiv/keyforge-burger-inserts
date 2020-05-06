import { helper } from '@ember/component/helper';

export default helper(function roundedStat(params) {
  let [ value ] = params;
  if(value === null || value === undefined) {
    return value;
  }

  let num = value;
  if(isNaN(num)){ // Handle String
    num = parseFloat(value);
  }
  return Math.round((num + Number.EPSILON) * 100) / 100
});
