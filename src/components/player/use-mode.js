import { computed } from "vue";
import { useStore } from "vuex";
import { PLAY_MODE, PLAY_MODE_TEXT } from "@/assets/js/constant";

export default function useMode() {
  const store = useStore();
  const playMode = computed(() => store.state.playMode);

  const modeIcon = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? "icon-sequence"
      : playModeVal === PLAY_MODE.random
      ? "icon-random"
      : "icon-loop";
  });
  const modeText = computed(() => PLAY_MODE_TEXT[store.state.playMode]);

  function changeMode() {
    const mode = (playMode.value + 1) % 3;
    store.dispatch("changeMode", mode);
  }
  return {
    modeIcon,
    modeText,
    changeMode,
  };
}
