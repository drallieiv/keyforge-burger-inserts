const CardSets = {
  'CALL_OF_THE_ARCHONS': {short: 'CotA', full: 'Call of the Archons', class:'set-cota', hue:'0', exp: 341},
  'AGE_OF_ASCENSION': {short: 'AoA', full: 'Age of Ascenscion' ,class:'set-aoa', hue:'201',  exp: 435},
  'WORLDS_COLLIDE': {short: 'WC', full: 'Worlds Collide', class:'set-wc', hue:'296',  exp: 452},
  'MASS_MUTATION': {short: 'MM', full: 'Mass Mutation', class:'set-mm', hue:'186',  exp: 479},
  'DARK_TIDINGS': {short: 'DT', full: 'Dark Tidings', class:'set-dt', hue:'245',  exp: 496},
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
  {csv: 'MASS_MUTATION', short: 'MM', full: 'Mass Mutation', class:'set-mm', exp: 479},
  {csv: 'DARK_TIDINGS', short: 'DT', full: 'Dark Tidings', class:'set-dt', exp: 496},
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
  { name:'Unfathomable', defaultIconPath: 'assets/icons/svg/house/Unfathomable.svg'},
]

export { CardSets, SearchExpansion, HouseList, ExpansionList };