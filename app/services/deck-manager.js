import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { all } from 'rsvp';
import { CardSets, SearchExpansion } from 'burger-inserts/data/keyforge-data';

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


  getDeckFromVault(vaultData) {
    let deckData = {
      id: vaultData.id,
      name: vaultData.name,
      masterVaultLink: 'https://www.keyforgegame.com/deck-details/' + vaultData.id,
      creationDate: new Date()
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
}
