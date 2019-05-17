export function saveToLocal(id, key, value) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  localStorage._seller_ = JSON.stringify(seller);
}
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def; //完全没有存储过，去读取，是默认值
  }
  seller = JSON.parse(seller)[id]; //转化成JSON对象，同时拿到对应的id
  if (!seller) {
    return def; //空的话，返回默认值
  }
  let ret = seller[key]; //否则返回对应的id值
  return ret || def;
}
