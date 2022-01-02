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
      .filter((item) => item.url.indexOf("vkey") > -1);
  });
}
