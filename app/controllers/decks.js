import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { all } from 'rsvp';
import PrintOptions from 'burger-inserts/dto/print-options';

const insertTypes = [
  { id: 'side', name: 'Side Only'},
  { id: 'top', name: 'Top Only'},
  { id: 'front', name: 'Front Only'},
  { id: 'front_top', name: 'Front and Top'},
  { id: 'front_side', name: 'Front and Side'},
  { id: 'all', name: 'Front, Top and Side'},
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
    return ['side', 'front_side', 'all'].includes(this.insertType.id);
  }
  get showTopOptions() {
    return ['top', 'front_top', 'all'].includes(this.insertType.id);
  }
  get showFrontOptions() {
    return ['front', 'front_top', 'front_side', 'all'].includes(this.insertType.id);
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

  get frontShowHouseBar() {
    return this.printOptions.get('front_ShowHouseBar');
  }
  set frontShowHouseBar(checked) {
    this.printOptions.set('front_ShowHouseBar', checked);
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
    if (file.name.endsWith('.csv')) {
      file.readAsText().then((csvdata) => {
        let jsData = this.csvToJs(csvdata);

        // For now send all to default folder
        let targetFolder = this.model.folders.firstObject;

        let deckCreationPromises = [];

        jsData.forEach((deckData) => {
          let importedDeck = this.deckManager.getDeckFromCsv(deckData);
          let savePromise = this.deckManager.saveOrUpdate(importedDeck).then((deck) => {
            if (targetFolder.decks.find((d) => d.id === deck.id) === undefined) {
              targetFolder.decks.pushObject(deck);
            }
          });
          deckCreationPromises.push(savePromise);
        });

        all(deckCreationPromises).then(() => {
          // Update Folder Size
          targetFolder.save();
          // Force Refresh
          this.set('model.folders', this.get('model.folders'));
        });
      })
    }
  }

  csvToJs(csv, splitter = ',', eol = '\n') {
    // From https://greywyvern.com/?post=258
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
