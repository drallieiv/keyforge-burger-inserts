import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { all, allSettled } from 'rsvp';
import { CardSets, SearchExpansion } from 'burger-inserts/data/keyforge-data';
import ENV from 'burger-inserts/config/environment';
import moment from 'moment';

export default class DeckManagerService extends Service {
  @service store;
  @service decksofkeyforge;

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
      aercScore: csvData['Raw Aerc Score'],
      aemberControl: csvData['Amber Control'],
      expectedAember: csvData['Expected Amber'],
      creatureProtection: csvData['Creature Protection'],
      artifactControl: csvData['Artifact Control'],
      creatureControl: csvData['Creature Control'],
      effectivePower: csvData['Effective Power'],
      efficiency: csvData['Efficiency'],
      disruption: csvData['Disruption'],
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
      creationDate: new Date(),
      source: 'csv'
    };

    return deckData;
  }

  getCustomDeck(customDeckData) {
    return {
      name: customDeckData.name,
      houses: customDeckData.houses.map((h) => h.name.replace(/ /g,'')),
      expansion: customDeckData.exp.csv,
      creationDate: new Date()
    };
  }

  getDeckFromVault(vaultData) {
    let deckData = {
      id: vaultData.id,
      name: vaultData.name,
      masterVaultLink: 'https://www.keyforgegame.com/deck-details/' + vaultData.id,
      creationDate: new Date(),
      source: 'vault'
    };

    let expansion = SearchExpansion(CardSets, vaultData.expansion);
    if(expansion) {
      deckData.expansion  = expansion;
    }

    // Vault House names have spaces
    let houses = vaultData._links.houses;
    houses = houses.map((h)=>h.replace(/ /g,''));
    deckData.houses = houses;

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
      this._mapDokData(savedDeck, deck);
      return savedDeck.save();
    }).catch(() => {
      let newDeck = this.store.createRecord('deck', deck);
      return newDeck.save();
    });
  }

  saveNew(deck) {
    let newDeck = this.store.createRecord('deck', deck);
    return newDeck.save();
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

  resyncAllDecks() {
    return this.store.findAll('deck').then((decks) => {
      let allPromises = decks.filter(this.shouldRefreshSas).map((deck) => {
        return this.updateDeckSAS(deck).then((syncedDeck) => {
          deck = syncedDeck;
        })
      });

      return allSettled(allPromises);
    });
  }

  loadFromCsv(file, targetFolder){
    return file.readAsText().then((csvdata) => {
      let jsData = this.csvToJs(csvdata);

      let deckCreationPromises = [];

      jsData.forEach((deckData) => {
        let importedDeck = this.getDeckFromCsv(deckData);
        let savePromise = this.saveOrUpdate(importedDeck).then((deck) => {
          if (targetFolder.decks.find((d) => d.id === deck.id) === undefined) {
            targetFolder.decks.pushObject(deck);
          }
        });
        deckCreationPromises.push(savePromise);
      });

      return all(deckCreationPromises).then(() => {
        // Update Folder Size
        targetFolder.save();
      });
    })
  }

  // CSV TO JS LIB From https://greywyvern.com/?post=258
  csvToJs(csv, splitter = ',', eol = '\n') {
    String.prototype.splitCSV = function (sep) {
      for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
        if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
          if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
            foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
          } else if (x) {
            foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
          } else foo = foo.shift().split(sep).concat(foo);
        } else foo[x].replace(/""/g, '"');
      } return foo;
    };

    let lines = csv.split(eol);
    let headers = lines[0].splitCSV(splitter);

    let result = [];

    for (var i = 1; i < lines.length; i++) {
      let obj = {};
      var currentline = lines[i].splitCSV(splitter);

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    return result;
  }

  updateDeckSAS(deck) {
    let deckId = this.extractDeckId(deck.masterVaultLink);
    return this.get('decksofkeyforge').getDeckStats(deckId).then((dokData) => {
      let dokDeckData = dokData.deck;
      deck.sasVersion = dokData.sasVersion;
      deck.aercVersion = dokData.aercVersion;

      this._mapDokData(deck, dokDeckData);

      return this.saveOrUpdate(deck);
    }).catch((error) => {
      console.log('Error upading Deck SAS', error);
      return null;
    });
  }

  // Sync all parameters shared between the 2 objects
  _mapDokData(destDeck, srcDeck){
    // Main Card type count
    destDeck.actionCount = srcDeck.actionCount || 0;
    destDeck.artifactCount = srcDeck.artifactCount || 0;
    destDeck.creatureCount = srcDeck.creatureCount || 0;
    destDeck.upgradeCount = srcDeck.upgradeCount || 0;

    // Totals
    destDeck.totalArmor = srcDeck.totalArmor || 0;
    destDeck.totalPower = srcDeck.totalPower || 0;

    // By Effect count
    destDeck.cardArchiveCount = srcDeck.cardArchiveCount || 0;
    destDeck.cardDrawCount = srcDeck.cardDrawCount || 0;
    destDeck.keyCheatCount = srcDeck.keyCheatCount || 0;
    
    // Just Aember
    // destDeck.rawAmber > See AE>A Mmapping
    
    // Computed data
    destDeck.aercScore = srcDeck.aercScore || 0;
    destDeck.antisynergyRating = srcDeck.antisynergyRating || 0;
    destDeck.artifactControl = srcDeck.artifactControl || 0;
    destDeck.creatureControl = srcDeck.creatureControl || 0;
    destDeck.creatureProtection = srcDeck.creatureProtection || 0;
    destDeck.disruption = srcDeck.disruption || 0;
    destDeck.effectivePower = srcDeck.effectivePower || 0;
    destDeck.efficiency = srcDeck.efficiency || 0;
    destDeck.sasPercentile = srcDeck.sasPercentile || 0;
    destDeck.sasRating = srcDeck.sasRating || 0;
    destDeck.synergyRating = srcDeck.synergyRating || 0;
    destDeck.other = srcDeck.other || 0;

    // SAS Specific Data
    destDeck.lastSasUpdate = srcDeck.lastSasUpdate;   

    // Data only available in csv export
    destDeck.house1SAS = srcDeck.house1SAS;
    destDeck.house2SAS = srcDeck.house2SAS;
    destDeck.house3SAS = srcDeck.house3SAS;

    // OP Data such as chains / power ... is skipped

    // Name Mapping override (Aember / amber)
    destDeck.aemberControl = srcDeck.aemberControl || srcDeck.amberControl;
    destDeck.expectedAember = srcDeck.expectedAember || srcDeck.expectedAmber;
    destDeck.rawAmber = srcDeck.rawAember || srcDeck.rawAmber;
  }

  shouldRefreshSas(deck) {
    // If no sas at all refresh
    if(!deck.lastSasUpdate  && !deck.sasVersion) {
      return true;
    }
    // Check on version first
    if(deck.sasVersion) { 
      return parseInt(deck.sasVersion) < ENV.dok.lastSasVersion;
    }

    // Else  on date
    return !deck.lastSasUpdate || moment(deck.lastSasUpdate).isBefore(moment(ENV.dok.lastSasUpdate));
  }
}
