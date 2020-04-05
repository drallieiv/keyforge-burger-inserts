import Adapter from 'ember-local-storage/adapters/local';

export default Adapter.extend({
  shouldReloadRecord(store, id) {
    return true;
  }
});

