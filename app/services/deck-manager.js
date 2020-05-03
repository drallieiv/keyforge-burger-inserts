import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { all } from 'rsvp';

export default class DeckManagerService extends Service {
  @service store;

  initDefaultFolders() {
    return this.store.findAll('deckFolder').then((folders) => {
      if (folders.length === 0) {
        console.log("Create new default folder");
        let defaultFolder = this.store.createRecord('deckFolder', {
          id: 'default',
          name: 'default',
        });
        defaultFolder.save();
      }
    });
  }

  getDeckFromCsv(csvData) {
    let deckId = this.extractDeckId(csvData['Master Vault Link']);
    let deckData = {
      id: deckId,
      name: csvData['Name'],
      houses: this.parseHouses(csvData['Houses']),
      expansion: csvData['Expansion'],
      sasRating: csvData['Sas Rating'],
      synergyRating: csvData['Synergy Rating'],
      antisynergyRating: csvData['Antisynergy Rating'],
      sasPercentile: csvData['Sas Percentile'],
      rawAercScore: csvData['Raw Aerc Score'],
      aemberControl: csvData['Amber Control'],
      expectedAember: csvData['Expected Amber'],
      aemberProtection: csvData['Aember Protection'],
      artifactControl: csvData['Artifact Control'],
      creatureControl: csvData['Creature Control'],
      effectivePower: csvData['Effective Power'],
      efficiency: csvData['Efficiency'],
      disruption: csvData['Disruption'],
      houseCheating: csvData['House Cheating'],
      other: csvData['Other'],
      house1SAS: csvData['House 1 SAS'],
      house2SAS: csvData['House 2 SAS'],
      house3SAS: csvData['House 3 SAS'],
      creatureCount: csvData['Creature Count'],
      actionCount: csvData['Action Count'],
      artifactCount: csvData['Artifact Count'],
      upgradeCount: csvData['Upgrade Count'],
      rawAmber: csvData['Raw Amber'],
      keyCheatCount: csvData['Key Cheat Count'],
      cardDrawCount: csvData['Card Draw Count'],
      cardArchiveCount: csvData['Card Archive Count'],
      totalPower: csvData['Total Power'],
      totalArmor: csvData['Total Armor'],
      dokLink: csvData['DoK Link'],
      masterVaultLink: csvData['Master Vault Link'],
      lastSasUpdate: csvData['Last SAS Update'],
      creationDate: new Date()
    };

    return deckData;
  }

  extractDeckId(masterVaultLink) {
    return masterVaultLink.match("[^/]+$")[0];
  }

  parseHouses(houseList) {
    // Old format, comma separated.
    // New format, pipe separated no space.

    // IE Polyfill in case
    if (!String.prototype.includes) {
      String.prototype.includes = function(search, start) {
        'use strict';
    
        if (search instanceof RegExp) {
          throw TypeError('first argument must not be a RegExp');
        } 
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
      };
    }
    if(houseList.includes("|")){
      return houseList.split("|").map((h)=> h.trim());
    } else if(houseList.includes(",")){
      return houseList.split(",").map((h)=> h.trim())
    } else {
      console.error("Failed to parse houses",houseList);
      return [];
    }
  }
  
  saveOrUpdate(deck) {

    return this.store.findRecord('deck', deck.id).then((savedDeck) => {
      savedDeck.sasRating = deck.sasRating;
      savedDeck.synergyRating = deck.synergyRating;
      savedDeck.antisynergyRating = deck.antisynergyRating;
      savedDeck.sasPercentile = deck.sasPercentile;
      savedDeck.rawAercScore = deck.rawAercScore;
      savedDeck.amberControl = deck.amberControl;
      savedDeck.expectedAember = deck.expectedAember;
      savedDeck.aemberProtection = deck.aemberProtection;
      savedDeck.artifactControl = deck.artifactControl;
      savedDeck.creatureControl = deck.creatureControl;
      savedDeck.effectivePower = deck.effectivePower;
      savedDeck.efficiency = deck.efficiency;
      savedDeck.disruption = deck.disruption;
      savedDeck.houseCheating = deck.houseCheating;
      savedDeck.other = deck.other;
      savedDeck.house1SAS = deck.house1SAS;
      savedDeck.house2SAS = deck.house2SAS;
      savedDeck.house3SAS = deck.house3SAS;
      savedDeck.lastSasUpdate = deck.lastSasUpdate;
      return savedDeck.save();
    }).catch(() => {
      let newDeck = this.store.createRecord('deck', deck);
      return newDeck.save();
    });
  }

  getDecksFolders() {
    return this.store.findAll('deckFolder');
  }

  removeAllDecks() {
    return this.store.findAll('deck').then((decks) => {
      let deckDeletePromises = [];
      decks.forEach((deck) => {
        // Remove link between decks and folder
        let removeLinkPromises = [];
        deck.folders.forEach((folder) => {
          folder.decks.removeObject(deck);
          removeLinkPromises.push(folder.save());
        });

        deckDeletePromises.push(all(removeLinkPromises).then(() => {
          // Remove the deck itself
          return deck.destroyRecord();
        }));
      })
      return all(deckDeletePromises).then(() => {
        this.store.unloadAll('deck');
      })
    });
  }
}
