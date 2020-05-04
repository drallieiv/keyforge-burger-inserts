import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isNotFoundError } from 'ember-ajax/errors';
import { later } from '@ember/runloop';


export default class CollectionController extends Controller {
  @service ajax;
  @service deckManager;
  
  webcamActive = false;

  newDecks = [];

  activeFolder = undefined;

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
    let url = '/mv/api/decks/codes/'+deckId+'/';
    this.get('ajax').request(url).then((response) => {
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
    let url = '/mv/api/decks/?page=1&page_size=10&ordering=-date&search=' + name;
    return this.get('ajax').request(url);
  }

  @action
  addDeckByName(name) {
    if(name && name.trim().length > 0) {
      this.getMasterVaultDeckDetails(name).then( vault => {
        console.debug('Vault Data', vault);
        this.set('nbDeckFound', vault.count);
        this.set('decksFound', vault.data);
        if(vault.count == 1) {
          this.addDeck(vault.data[0]);
        }
      });
    }    
  }

  @action
  selectFoundDeck(deck) {
    this.set('decksFoundSelected', deck);
  }

  @action
  deckNameChanged() {
    this.set('nbDeckFound', undefined);
  }

  @action
  addDeck(deckData) {
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
      console.debug('Valid deck scanned : '+deckPrivId);
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
}