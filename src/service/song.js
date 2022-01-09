import { get } from "./base";

export function processSongs(songs) {
  if (!songs.length) return Promise.resolve(songs);
  return get("/api/getSongsUrl", {
    mid: songs.map((item) => item.mid),
  }).then((res) => {
    const urls = res.map;
    return songs
      .map((item) => {
        item.url = urls[item.mid];
        return item;
      })
      .filter((item) => item.url && item.url.indexOf("vkey") > -1);
  });
}

let lyricMap = {};
export function getLyric(song) {
  // 如有缓存，则直接返回缓存，不发送新的请求
  if (song.lyric) return Promise.resolve(song.lyric);
  // 如map有数据，则直接返回map数据
  const mid = song.mid;
  const lyric = lyricMap[mid];
  if (lyric) return Promise.resolve(lyric);
  // 请求服务端
  return get("/api/getLyric", { mid }).then((result) => {
    const lyric = result ? result.lyric : "[00:00:00]毫无歌词介个";
    lyricMap[mid] = lyric;
    return lyric;
  });
}
