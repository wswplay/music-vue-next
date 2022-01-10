import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from "@/assets/js/constant";
import { loadStorage } from "@/assets/js/array-store";

const state = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  curIndex: 0,
  fullScreen: false,
  favoriteList: loadStorage(FAVORITE_KEY),
  searchHistory: loadStorage(SEARCH_KEY),
};

export default state;
