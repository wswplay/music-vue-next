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

export function formateTime(time) {
  // 向下取整
  time = time | 0;
  const minute = (((time / 60) | 0) + "").padStart(2, 0);
  const second = ((time % 60) + "").padStart(2, 0);
  return `${minute}:${second}`;
}
