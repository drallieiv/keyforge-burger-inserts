import { tracked } from '@glimmer/tracking';

export default class PrintOptions {
   
  @tracked _options = {};

  preferences = null;

  constructor(preferences, options) {
    this.polyFillAssign();
    
    this.preferences = preferences;

    let defaultOptions = {
      side_showSet: true,
      front_showSet: true,
      front_showHeader: true,
      front_HouseBarUseColor: true,
      front_showFooter: false,
      front_sas_showStats: true,
      front_sas_showBasic: true,
      sas_showScore: true,
      sas_showHouseBar: true,
      showSetColor: false,
      spacePrintBlock: false,
      houseIconsStyle: 'full', // or 'line'
    }

    this._options = defaultOptions;

    if(options) {
      // Given Options
      Object.assign(this._options, options);
    }
  }

  set(key, value) {
    this._options[key] = value;

    // trigger an update
    let currentOptions = this._options;
    this._options = currentOptions;

    // Save preferences
    this.preferences.printOptions = this;
  }

  get(key) {
    return this._options[key];
  }

  toJson() {
    return JSON.stringify(this._options);
  }

  polyFillAssign() {
    if (!Object.assign) {
      Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
          'use strict';
          if (target === undefined || target === null) {
            throw new TypeError('Cannot convert first argument to object');
          }
    
          var to = Object(target);
          for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource === undefined || nextSource === null) {
              continue;
            }
            nextSource = Object(nextSource);
    
            var keysArray = Object.keys(Object(nextSource));
            for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
              var nextKey = keysArray[nextIndex];
              var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
              if (desc !== undefined && desc.enumerable) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
          return to;
        }
      });
    }
  }
}