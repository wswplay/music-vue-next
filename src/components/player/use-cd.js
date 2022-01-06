import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

export default function useCD() {
  const cdRef = ref(null);
  const cdImageRef = ref(null);

  const store = useStore();
  const playing = computed(() => store.state.playing);
  const cdClass = computed(() => (playing.value ? "playing" : ""));

  watch(playing, (val) => {
    if (!val) {
      syncTransform(cdRef.value, cdImageRef.value);
    }
  });

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform;
    const innerTransform = getComputedStyle(inner).transform;
    wrapper.style.transform =
      wrapperTransform === "none"
        ? innerTransform
        : innerTransform.concat(" ", wrapperTransform);
  }

  return {
    cdClass,
    cdRef,
    cdImageRef,
  };
}
