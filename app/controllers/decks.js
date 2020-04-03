import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { all } from 'rsvp';
import PrintOptions from 'burger-inserts/dto/print-options';

const countries = [
  { name: 'United States', flagUrl: '/flags/us.svg' },
  { name: 'Spain', flagUrl: '/flags/es.svg' },
  { name: 'Portugal', flagUrl: '/flags/pt.svg' },
  { name: 'Russia', flagUrl: '/flags/ru.svg' },
  { name: 'Latvia', flagUrl: '/flags/lv.svg' },
  { name: 'Brazil', flagUrl: '/flags/br.svg' },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
];

const insertTypes = [
  { id: 'side', name: 'Side Only', insertClass: 'box-insert-side' },
  { id: 'top', name: 'Top Only', insertClass: 'box-insert-top' },
  /*
  { id: 'front', name: 'Front Only', insertClass: 'box-insert-front' },
  { id: 'group', name: 'All Grouped', insertClass: 'box-insert-group' },
  */
];

export default class DecksController extends Controller {
  @service deckManager;

  printOptions = new PrintOptions();

  insertTypes = insertTypes;
  // Side by default
  @tracked insertType = insertTypes[0];

  foo() { }

  get folderToPrint() {
    return this.model.folders.firstObject;
  }

  get decksToPrint() {
    return this.folderToPrint.decks;
  }

  /*  Print Options */

  get sideShowSet() {
    return this.printOptions.get('side_showSet');
  }
  set sideShowSet(checked) {
    this.printOptions.set('side_showSet', checked);
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
              console.debug('add new deck to folder');
              targetFolder.decks.pushObject(deck);
            }
          });
          deckCreationPromises.push(savePromise);
        });

        all(deckCreationPromises).then(() => {
          // Update Folder Size
          console.debug('All Decks added to folder')
          targetFolder.save();
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
