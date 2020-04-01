import Model, { attr, hasMany } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';

export default class DeckFolderModel extends Model {
  @attr('string') name;
  @hasMany('deck') decks;

  get count() {
    return this.decks.length;
  }
}
