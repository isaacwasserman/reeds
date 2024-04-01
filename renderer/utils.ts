function objectMapToArray(object, mapFn) {
  let keys = Object.keys(object);
  let values = keys.map((key) => mapFn(object[key], key));
  return values;
}

function objectFilter(object, filterFn) {
  let keys = Object.keys(object);
  let passing_keys = keys.filter((key) => filterFn(object[key], key));
  let output = {};
  passing_keys.forEach((key) => {
    output[key] = object[key];
  });
  return output;
}

function mapKeys(keys, mapFn) {
  let values = keys.map((key) => mapFn(key));
  let output = {};
  keys.forEach((key, index) => {
    output[key] = values[index];
  });
  return output;
}

export { objectMapToArray, objectFilter, mapKeys };
