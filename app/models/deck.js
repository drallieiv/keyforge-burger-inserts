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
  @attr('number') aercScore;
  @attr('number') aemberControl;
  @attr('number') expectedAember;
  @attr('number') creatureProtection;
  @attr('number') artifactControl;
  @attr('number') creatureControl;
  @attr('number') effectivePower;
  @attr('number') efficiency;
  @attr('number') recursion;
  @attr('number') disruption;
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
  @attr('number') meta;

  @attr('string') dokLink;
  @attr('string') masterVaultLink;
  @attr('string') lastSasUpdate;

  @attr('string') sasVersion;

  @attr('date') creationDate;

  @attr('string') source;

  @hasMany('deck-folder', { async: true }) folders;

  get synergyCombo() {
    let text = this.synergyRating;
    if (this.antisynergyRating > 0) {
      text = text + " - " + this.antisynergyRating;
    }
    return text;
  }
  
}
