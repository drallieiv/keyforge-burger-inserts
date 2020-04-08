import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PrintOptions {
   
  @tracked _options = {};

  preferences = null;

  constructor(preferences, options) {
    this.preferences = preferences;
    if(options) {
      // Given Options
      this._options = options;
    }else{
      // Default
      this._options = {
        side_showSet: true,
        front_showSet: true,
        front_showHeader: true,
        front_showFooter: false,
        front_showSetColor: false,
      }
    }
  }

  set(key, value) {
    this._options[key] = value;

    // trigger an update
    this._options = this._options;

    // Save preferences
    this.preferences.printOptions = this;
  }

  get(key) {
    return this._options[key];
  }

  toJson() {
    return JSON.stringify(this._options);
  }
}