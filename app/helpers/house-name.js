import { helper } from '@ember/component/helper';

export default helper(function houseName(params) {
  let [ houseName ] = params;
  return houseName.split(/(?=[A-Z])/).join(' ');
});
