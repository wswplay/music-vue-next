// 经典洗牌函数
export function shuffle(source) {
  const list = source.slice();
  for (let i = 0; i < list.length; i++) {
    const j = getRandomInt(i);
    swap(list, i, j);
  }
  return list;
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

export function swap(list, i, j) {
  const t = list[i];
  list[i] = list[j];
  list[j] = t;
}
