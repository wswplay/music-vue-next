import { PLAY_MODE } from "@/assets/js/constant";
import { shuffle } from "@/assets/js/util";

export function selectPlay({ commit }, { list, index }) {
  commit("setPlayMode", PLAY_MODE.sequence);
  commit("setSequenceList", list);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
  commit("setPlayList", list);
  commit("setCurIndex", index);
}

export function randomPlay({ commit }, list) {
  commit("setPlayMode", PLAY_MODE.random);
  commit("setSequenceList", list);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
  commit("setPlayList", shuffle(list));
  commit("setCurIndex", 0);
}

export function changeMode({ commit, state, getters }, mode) {
  const curSongId = getters.currentSong.id;
  if (mode === PLAY_MODE.random) {
    commit("setPlayList", shuffle(state.sequenceList));
  } else {
    commit("setPlayList", state.sequenceList);
  }
  const index = state.playList.findIndex((item) => item.id === curSongId);
  commit("setCurIndex", index);
  commit("setPlayMode", mode);
}

export function removeSong({ commit, state }, song) {
  let sequenceList = state.sequenceList.slice();
  let playList = state.playList.slice();

  const sequenceIndex = findItemIndex(sequenceList, song);
  const playIndex = findItemIndex(playList, song);
  if (sequenceIndex < 0 || playIndex < 0) return;

  sequenceList.splice(sequenceIndex, 1);
  playList.splice(playIndex, 1);

  let curIndex = state.curIndex;
  if (playIndex < curIndex || curIndex === playList.length) {
    curIndex--;
  }

  commit("setSequenceList", sequenceList);
  commit("setPlayList", playList);
  commit("setCurIndex", curIndex);
  if (!playList.length) commit("setPlayingState", false);
}

export function clearSongList({ commit }) {
  commit("setSequenceList", []);
  commit("setPlayList", []);
  commit("setCurIndex", 0);
  commit("setPlayingState", false);
}

export function addSong({ commit, state }, song) {
  const playList = state.playList.slice();
  const sequenceList = state.sequenceList.slice();
  let curIndex = state.curIndex;
  const playIndex = findItemIndex(playList, song);
  const sequenceIndex = findItemIndex(sequenceList, song);

  if (playIndex > -1) {
    curIndex = playIndex;
  } else {
    playList.push(song);
    curIndex = playList.length - 1;
  }
  if (sequenceIndex === -1) sequenceList.push(song);

  commit("setSequenceList", sequenceList);
  commit("setPlayList", playList);
  commit("setCurIndex", curIndex);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
}

function findItemIndex(list, item) {
  return list.findIndex((sit) => sit.id === item.id);
}
