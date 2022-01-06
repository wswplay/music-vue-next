import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { getLyric } from "../../service/song";
import Lyric from "lyric-parser";

export default function useLyric({ isReady, currentTime }) {
  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);
  const currentLyric = ref(null);
  const currentLineNum = ref(0);
  const lyricScrollRef = ref(null);
  const lyricListRef = ref(null);

  watch(currentSong, async (val) => {
    if (!val.url || !val.id) return;
    stopLyric();
    currentLyric.value = null;
    currentLineNum.value = 0;

    const lyric = await getLyric(val);
    store.commit("addSongLyric", {
      song: val,
      lyric,
    });
    if (currentSong.value.lyric !== lyric) return;

    currentLyric.value = new Lyric(lyric, handleLyric);
    if (isReady.value) playLyric();
  });

  function playLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000);
    }
  }
  function stopLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.stop();
    }
  }
  function handleLyric({ lineNum }) {
    const scrollFlag = 5;
    currentLineNum.value = lineNum;
    const scrollComp = lyricScrollRef.value;
    const listEl = lyricListRef.value;

    if (!listEl) return;
    if (lineNum > scrollFlag) {
      const lineEl = listEl.children[lineNum - scrollFlag];
      scrollComp.scroll.scrollToElement(lineEl, 1000);
    } else {
      scrollComp.scroll.scrollToElement(0, 0, 1000);
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric,
  };
}
