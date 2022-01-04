import storage from "good-storage";

export function save(item, key, compare, maxLength) {
  const items = storage.get(key, []);
  insertArray(items, item, compare, maxLength);
  storage.set(key, items);
  return items;
}

export function remove(key, compare) {
  const items = storage.get(key, []);
  deleteFromArray(items, compare);
  storage.set(key, items);
  return items;
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
function insertArray(arr, val, compare, maxLength) {
  const index = arr.findIndex(compare);
  if (index > -1) return;
  arr.unshift(val);
  if (maxLength && arr.length > maxLength) {
    arr.pop();
  }
}
export function loadStorage(key) {
  return storage.get(key, []);
}
