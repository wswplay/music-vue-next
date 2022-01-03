import { PLAY_MODE } from "@/assets/js/constant";

const state = {
  sequenceList: [],
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  curIndex: 0,
  fullScreen: false,
};

export default state;
