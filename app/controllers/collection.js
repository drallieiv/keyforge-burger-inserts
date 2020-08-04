import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isNotFoundError } from 'ember-ajax/errors';
import { later } from '@ember/runloop';
import { debounce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

export default class CollectionController extends Controller {
  @service deckManager;
  @service mastervault;
  
  webcamActive = false;

  @tracked isResyncAllDecksPending = false;

  newDecks = [];

  activeFolder = undefined;

  customDeck = {
    name: undefined,
    exp: undefined,
    houses: [],
  }

  get activeFolderDecks() {
    return this.activeFolder.decks;
  }

  get folders() {
    return this.model.folders;
  }

  addToLog(text) {
    let log = document.getElementById("log-window");
    log.innerHTML = text + '<br>' + log.innerHTML;
  }
  @action
  clearLog() {
    document.getElementById("log-window").innerHTML = '';
  }

  flashColor(isValid) {
    if(isValid) {
      this.set('validCodeFound', true);
      later(() => {
        this.set('validCodeFound', false);
      }, 2000);
    } else {
      this.set('invalidCodeFound', true);
      later(() => {
        this.set('invalidCodeFound', false);
      }, 2000);
    }
  }

  /**
   * Check if the deck is registerd on Master Vault
   * @param {string} deckId 
   */
  checkDeckOnVault(deckId) {
    return this.get('mastervault').checkDeckCode(deckId).then((response) => {
      let deckName = response.name;
      this.addDeckByName(deckName);
      this.flashColor(true);
    }).catch((error) => {
      if (isNotFoundError(error)) {
        this.addToLog('New undiscovered deck found : ' + deckId);
        this.newDecks.pushObject({code: deckId});
      } else {
        console.error('Unexpected error with vault', error);
      }
      this.flashColor(false);
    });
  }

  getMasterVaultDeckDetails(name) {
    this.addToLog('Searching deck by name in MasterVault. Please wait.');
    return this.get('mastervault').searchDeckByName(name);
  }

  @action
  addDeckByName(name) {
    if(name && name.trim().length > 0) {
      debounce(this, this._addDeckByName, name, 500);
    }    
  }

  _addDeckByName(name) {
    this.getMasterVaultDeckDetails(name).then( vault => {
      console.debug('Vault Data', vault);
      this.set('nbDeckFound', vault.count);
      this.set('decksFound', vault.data);
      if(vault.count == 1) {
        this.addDeck(vault.data[0]);
      } else {
        this.addToLog('Multiple decks found, please choose the right one');
      }
    });
  }

  @action
  selectFoundDeck(deck) {
    this.set('decksFoundSelected', deck);
  }

  @action
  deckNameChanged() {
    this.set('nbDeckFound', undefined);
  }

  // Custom Deck
  @action
  setCustomDeckExp(exp) {
    this.set('customDeck.exp', exp);
  }

  @action
  setCustomDeckHouses(houses) {
    this.set('customDeck.houses', houses);
  }

  @action
  addCustomDeck() {
    let targetFolder = this.activeFolder;
    let newCustomDeck = this.deckManager.getCustomDeck(this.customDeck);
    
    this.deckManager.saveNew(newCustomDeck).then((deck) => {
      if (targetFolder.decks.find((d) => d.id === deck.id) === undefined) {
        targetFolder.decks.pushObject(deck);
        targetFolder.save();
      }
    });   

    this.addToLog('Added custom deck '+newCustomDeck.name);
  }

  @action
  addDeck(deckData) {
    debounce(this, this._addDeck, deckData, 1000);
  }

  _addDeck(deckData) {
    let targetFolder = this.activeFolder;
    let importedDeck = this.deckManager.getDeckFromVault(deckData);

    this.deckManager.saveOrUpdate(importedDeck).then((deck) => {
      if (targetFolder.decks.find((d) => d.id === deck.id) === undefined) {
        targetFolder.decks.pushObject(deck);
        targetFolder.save();
      }
    });   

    this.addToLog('Added deck '+deckData.name);
  }

  @action
  startWebcam() {
    this.set('webcamActive',true);
  }
  @action
  stopWebcam() {
    this.set('webcamActive',false);
  }
  
  @action
  onScanSuccess(found)  {
    let exp = 'https://www.keyforgegame.com/deck/([0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5})';
    let match = found.text.match(exp);
    if(match){
      let deckPrivId = match[1];
      this.addToLog('Scanned a deck with QR code '+deckPrivId);
      this.addToLog('Searching in MasterVault. Please wait.');
      this.checkDeckOnVault(deckPrivId);
      
    } else {
      this.flashColor(false);
    }
    this.set('continueScanning', true);
  }

  // Scan and camera related stuff 

  @action
  onScanError()  {

  }
  @action
  onCamerasFound(cameras)  {
    console.log(cameras.length + " cameras found", cameras);
    this.set('cameras', cameras);
  }
  @action
  switchCamera(camera) {
    this.set('camera', camera);
    this.set('cameraId', camera.deviceId);
  }
  @action
  onCamerasError()  {

  }

  // Collection related stuff

  @action
  clearDecks() {
    this.deckManager.removeAllDecks();
  }
  
  @action
  uploadDokCsv(file) {
    // For now send all to default folder
    if (file.name.endsWith('.csv')) {
      this.deckManager.loadFromCsv(file, this.activeFolder);
    }
  }

  @action
  dokResync() {
    this.isResyncAllDecksPending = true;
    this.deckManager.resyncAllDecks().then(() =>{
      console.log("resyncAllDecks DONE");
      this.isResyncAllDecksPending = false;
    })
  }

  // get SAS Data for decks
  @action
  updateDeckSas(deck, doneCallback) {
    console.log('Get SAS data for deck', deck);
    this.deckManager.updateDeckSAS(deck).then(() => {
      doneCallback({
        'dokCallSuccess': true,
        'deckUpdateSuccess': true
      });
    });
  }

}