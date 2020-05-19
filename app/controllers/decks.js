import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const insertTypes = [
  { id: 'side', name: 'Side Only'},
  { id: 'top', name: 'Top Only'},
  { id: 'front', name: 'Front Only'},
  { id: 'front_top', name: 'Front and Top'},
  { id: 'front_side', name: 'Front and Side'},
  { id: 'all', name: 'Front, Top and Side'},
  { id: 'box_v', name: 'Deckbox'},
];

const deckboxFormats = [
  { id: 'BT_slim', name: 'Burger Tokens Unsleeved', boxClass: 'bt-slim' },
  { id: 'BT_large', name: 'Burger Tokens Sleeved', boxClass: 'bt-large' },
  { id: 'BT_xlarge', name: 'Burger Tokens Dbl. Slv.', boxClass: 'bt-xlarge' },
]

export default class DecksController extends Controller {
  @service deckManager;

  @service preferences;

  printOptions;

  insertTypes = insertTypes;
  @tracked insertType;

  deckboxFormats = deckboxFormats;
  @tracked deckboxFormat;

  constructor() {
    super(...arguments);
    // Load From Preferences
    this.printOptions = this.preferences.printOptions;
    let insertTypeId = this.preferences.get('insertTypeId', 'side');
    this.insertType = insertTypes.filter(type => (type.id == insertTypeId)).firstObject;
    let deckboxFormatId = this.preferences.get('deckboxFormatId', 'BT_slim');
    this.deckboxFormat = deckboxFormats.filter(format => (format.id == deckboxFormatId)).firstObject;
  }

  get folderToPrint() {
    return this.model.folders.firstObject;
  }

  get decksToPrint() {
    return this.folderToPrint.decks;
  }

  /*  Print Options */

  get showSideOptions() {
    return ['side', 'front_side', 'all', 'box_v'].includes(this.insertType.id);
  }
  get showTopOptions() {
    return ['top', 'front_top', 'all', 'box_v'].includes(this.insertType.id);
  }
  get showFrontOptions() {
    return ['front', 'front_top', 'front_side', 'all', 'box_v'].includes(this.insertType.id);
  }
  
  get sideShowSet() {
    return this.printOptions.get('side_showSet');
  }
  set sideShowSet(checked) {
    this.printOptions.set('side_showSet', checked);
  }

  get frontShowSet() {
    return this.printOptions.get('front_showSet');
  }
  set frontShowSet(checked) {
    this.printOptions.set('front_showSet', checked);
  }

  get frontShowHeader() {
    return this.printOptions.get('front_showHeader');
  }
  set frontShowHeader(checked) {
    this.printOptions.set('front_showHeader', checked);
  }

  get frontHouseBarColor() {
    return this.printOptions.get('front_HouseBarUseColor');
  }
  set frontHouseBarColor(checked) {
    this.printOptions.set('front_HouseBarUseColor', checked);
  }  

  get frontShowFooter() {
    return this.printOptions.get('front_showFooter');
  }
  set frontShowFooter(checked) {
    this.printOptions.set('front_showFooter', checked);
  }

  get showSetColor() {
    return this.printOptions.get('showSetColor');
  }
  set showSetColor(checked) {
    this.printOptions.set('showSetColor', checked);
  }
  
  get printSheetBlockSpaced() {
    return this.printOptions.get('spacePrintBlock');
  }
  set printSheetBlockSpaced(checked) {
    this.printOptions.set('spacePrintBlock', checked);
  }

  get printSheetBlockStyle() {
    return this.printSheetBlockSpaced ? 'space' : 'no-space';
  }

  get useHouseIconFullColor() {
    return this.printOptions.get('houseIconsStyle') === 'full';
  }
  set useHouseIconFullColor(checked) {
    this.printOptions.set('houseIconsStyle', checked ? 'full' : 'line');
  }

  // SAS Related Toggles

  get showSasScore() {
    return this.printOptions.get('sas_showScore');
  }
  set showSasScore(checked) {
    this.printOptions.set('sas_showScore', checked);
  }
  get showSasHouseBar() {
    return this.printOptions.get('sas_showHouseBar');
  }
  set showSasHouseBar(checked) {
    this.printOptions.set('sas_showHouseBar', checked);
  }
  get frontShowSasStats() {
    return this.printOptions.get('front_sas_showStats');
  }
  set frontShowSasStats(checked) {
    this.printOptions.set('front_sas_showStats', checked);
  }
  get frontShowBasicCount() {
    return this.printOptions.get('front_sas_showBasic');
  }
  set frontShowBasicCount(checked) {
    this.printOptions.set('front_sas_showBasic', checked);
  }

  @action
  setInsertType(type) {
    this.preferences.set('insertTypeId', type.id);
    this.insertType = type;
  }

  @action
  setDeckboxFormat(format) {
    this.preferences.set('deckboxFormatId', format.id);
    this.deckboxFormat = format;
  }
  
  @action
  clearDecks() {
    this.deckManager.removeAllDecks();
  }

  @action
  uploadDokCsv(file) {
    // For now send all to default folder
    let targetFolder = this.model.folders.firstObject;
    if (file.name.endsWith('.csv')) {
      this.deckManager.loadFromCsv(file, targetFolder).then(() => {
        // Force Refresh
        this.set('model.folders', this.get('model.folders'));
      });
    }
  }

  @action
  allColor() {
    this.set('useHouseIconFullColor', true);
    this.set('frontHouseBarColor', true);
    this.set('showSetColor', true);
  }

  @action
  allBlackAndWhite() {
    this.set('useHouseIconFullColor', false);
    this.set('frontHouseBarColor', false);
    this.set('showSetColor', false);
  }

  @action
  allSAS() {
    this.set('showSasScore', true);
    this.set('showSasHouseBar', true);
    this.set('frontShowBasicCount', true);
    this.set('frontShowSasStats', true);
  }

  @action
  noSAS() {
    this.set('showSasScore', false);
    this.set('showSasHouseBar', false);
    this.set('frontShowBasicCount', false);
    this.set('frontShowSasStats', false);
  }

}
