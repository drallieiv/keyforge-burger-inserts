import Model, { attr, hasMany } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';

export default class DeckFolderModel extends Model {
  @attr('string') name;
  @hasMany('deck', { async: true}) decks;

  get count() {
    return this.decks.length;
  }
}
