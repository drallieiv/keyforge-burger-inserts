import Transform from '@ember-data/serializer/transform';

export default class HousesListTransform extends Transform {
  deserialize(serialized) {
    return serialized.split(',');
  }

  serialize(deserialized) {
    return deserialized.join(',');
  }
}
