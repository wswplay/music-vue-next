import { computed, ref } from "vue";

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18;
  const scrollRef = ref(null);
  const shortcutList = computed(() => {
    return props.data.map((item) => item.title);
  });

  const touch = {};
  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index);
    touch.y1 = e.touches[0].pageY;
    touch.anchorIndex = anchorIndex;
    scrollTo(anchorIndex);
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    const rate = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0;
    const moveIndex = touch.anchorIndex + rate;
    scrollTo(moveIndex);
  }

  function scrollTo(index) {
    if (isNaN(index)) return;
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index));
    const targetEl = groupRef.value.children[index];
    const scroll = scrollRef.value.scroll;
    scroll.scrollToElement(targetEl, 0);
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove,
  };
}
