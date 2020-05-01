const CardSets = {
  'CALL_OF_THE_ARCHONS': {short: 'CotA', full: 'Call of the Archons', class:'set-cota', exp: 341},
  'AGE_OF_ASCENSION': {short: 'AoA', full: 'Age of Ascenscion' ,class:'set-aoa', exp: 435},
  'WORLDS_COLLIDE': {short: 'WC', full: 'Worlds Collide', class:'set-wc', exp: 452},
  'MASS_MUTATION': {short: 'MM', full: 'Mass Mutation', class:'set-mm'},
};

let SearchExpansion =  function(sets, exp) {
  for(var set in sets){
    if(sets[set].exp === exp) {
      return set;
    }
  }
  return null;
};

const ExpansionList = [
  {csv: 'CALL_OF_THE_ARCHONS', short: 'CotA', full: 'Call of the Archons', class:'set-cota', exp: 341},
  {csv: 'AGE_OF_ASCENSION', short: 'AoA', full: 'Age of Ascenscion' ,class:'set-aoa', exp: 435},
  {csv: 'WORLDS_COLLIDE', short: 'WC', full: 'Worlds Collide', class:'set-wc', exp: 452},
  {csv: 'MASS_MUTATION', short: 'MM', full: 'Mass Mutation', class:'set-mm'},
];

const HouseList = [
  { name:'Brobnar', defaultIconPath: 'assets/icons/svg/house/Brobnar.svg'},
  { name:'Logos', defaultIconPath: 'assets/icons/svg/house/Logos.svg'},
  { name:'Sanctum', defaultIconPath: 'assets/icons/svg/house/Sanctum.svg'},
  { name:'Mars', defaultIconPath: 'assets/icons/svg/house/Mars.svg'},
  { name:'Dis', defaultIconPath: 'assets/icons/svg/house/Dis.svg'},
  { name:'Shadows', defaultIconPath: 'assets/icons/svg/house/Shadows.svg'},
  { name:'Untamed', defaultIconPath: 'assets/icons/svg/house/Untamed.svg'},
  { name:'Star Alliance', defaultIconPath: 'assets/icons/svg/house/StarAlliance.svg'},
  { name:'Saurian', defaultIconPath: 'assets/icons/svg/house/Saurian.svg'},
]

export { CardSets, SearchExpansion, HouseList, ExpansionList };