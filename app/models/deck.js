import Model, { attr, hasMany } from '@ember-data/model';

export default class DeckModel extends Model {
  // Copy of DoK API/Export data format
  @attr('string') name;
  @attr('housesList') houses;
  @attr('string') expansion;
  @attr('number') sasRating;
  @attr('number') synergyRating;
  @attr('number') antisynergyRating;
  @attr('number') sasPercentile
  @attr('number') rawAercScore;
  @attr('number') amberControl;
  @attr('number') expectedAmber;
  @attr('number') aemberProtection;
  @attr('number') artifactControl;
  @attr('number') creatureControl;
  @attr('number') effectivePower;
  @attr('number') efficiency;
  @attr('number') disruption;
  @attr('number') houseCheating;
  @attr('number') other;
  @attr('number') house1SAS;
  @attr('number') house2SAS;
  @attr('number') house3SAS;
  @attr('number') creatureCount;
  @attr('number') actionCount;
  @attr('number') artifactCount;
  @attr('number') upgradeCount;
  @attr('number') rawAmber;
  @attr('number') keyCheatCount;
  @attr('number') cardDrawCount;
  @attr('number') cardArchiveCount;
  @attr('number') totalPower;
  @attr('number') totalArmor;

  @attr('string') doKLink;
  @attr('string') masterVaultLink;
  @attr('string') lastSASUpdate;

  @hasMany('deck-folder') folders;
}
