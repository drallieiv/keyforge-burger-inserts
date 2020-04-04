import { tracked } from '@glimmer/tracking';

export default class PrintOptions {
  @tracked _options = {};

  constructor() {
    this._options = {
      side_showSet: true,
      front_showSet: true,
      front_showHeader: true,
      front_showFooter: true,
    }
  }

  set(key, value) {
    this._options[key] = value;

    // trigger an update
    this._options = this._options;
  }

  get(key) {
    return this._options[key];
  }
}