const mutations = {
  setPlayingState(state, playing) {
    state.playing = playing;
  },
  setSequenceList(state, list) {
    state.sequenceList = list;
  },
  setPlayList(state, list) {
    state.playList = list;
  },
  setPlayMode(state, mode) {
    state.playMode = mode;
  },
  setCurIndex(state, index) {
    state.curIndex = index;
  },
  setFullScreen(state, isFull) {
    state.fullScreen = isFull;
  },
  setFavoriteList(state, list) {
    state.favoriteList = list;
  },
  addSongLyric(state, { song, lyric }) {
    state.sequenceList.map((item) => {
      if (item.mid === song.mid) item.lyric = lyric;
      return item;
    });
  },
  setSearchHistory(state, list) {
    state.searchHistory = list;
  },
  setPlayHistory(state, list) {
    state.playHistory = list;
  },
};

export default mutations;
