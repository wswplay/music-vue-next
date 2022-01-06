import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { getLyric } from "../../service/song";
import Lyric from "lyric-parser";

export default function useLyric() {
  const store = useStore();
  const currentSong = computed(() => store.getters.currentSong);
  const currentLyric = ref(null);

  watch(currentSong, async (val) => {
    if (!val.url || !val.id) return;
    const lyric = await getLyric(val);
    store.commit("addSongLyric", {
      song: val,
      lyric,
    });
    if (currentSong.value.lyric !== lyric) return;

    currentLyric.value = new Lyric(lyric, handleLyric);
  });

  function handleLyric() {
    // sth
  }
}
