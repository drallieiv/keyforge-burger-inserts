import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class DecksRoute extends Route {
    @service deckManager;

    model() {
        let promises = {
            folders: this.deckManager.getDecksFolders(),
        };

        return hash(promises).then(function (hash) {
            console.log(hash);
            return hash;
        });
    }
}
