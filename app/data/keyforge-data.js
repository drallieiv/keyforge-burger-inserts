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

export { CardSets, SearchExpansion };