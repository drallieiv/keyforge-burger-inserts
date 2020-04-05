import Service from '@ember/service';
import PrintOptions from 'burger-inserts/dto/print-options';

export default class PreferencesService extends Service {

  get printOptions() {
    let savedOptions = localStorage.getItem("pref.printOptions");
    if (savedOptions) {
      return new PrintOptions(this, JSON.parse(savedOptions));
    } else {
      return new PrintOptions(this);
    }
  }

  set printOptions(options) {
    localStorage.setItem("pref.printOptions", options.toJson());
  }

  get(key, defaultValue) {
    return localStorage.getItem("pref."+key) || defaultValue;
  }

  set(key, value) {
    return localStorage.setItem("pref."+key, value);
  }
}
