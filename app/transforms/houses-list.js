import Transform from '@ember-data/serializer/transform';

export default class HousesListTransform extends Transform {
  separator = ',';
  deserialize(serialized) {
    return serialized.split(this.separator);
  }

  serialize(deserialized) {
    return deserialized.join(this.separator);
  }
}
