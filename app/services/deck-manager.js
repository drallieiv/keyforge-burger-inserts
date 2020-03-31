import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class DeckManagerService extends Service {
    @service store;

    initDefaultFolders() {
        return this.store.findAll('deckFolder').then((folders) => {
            if(folders.length === 0) {
                console.log("Create new default folder");
                let defaultFolder = this.store.createRecord('deckFolder', {
                    name: 'default',
                });
                defaultFolder.save();
            }
        });
    }

    getDecksFolders() {
        return this.store.findAll('deckFolder');
    }
}
