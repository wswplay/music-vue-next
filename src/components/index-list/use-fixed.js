import { computed, nextTick, ref, watch } from "vue";

export default function useFixed(props) {
  const TITLE_HEIGHT = 30;
  const groupRef = ref(null);
  const listHeights = ref([]);
  const scrollY = ref(0);
  const curIndex = ref(0);
  const distance = ref(0);

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) return "";
    const curGroup = props.data[curIndex.value];
    return (curGroup && curGroup.title) || "";
  });

  const fixedStyle = computed(() => {
    const distanceVal = distance.value;
    const diff =
      distanceVal > 0 && distanceVal < TITLE_HEIGHT
        ? distanceVal - TITLE_HEIGHT
        : 0;
    return {
      transform: `translate3d(0, ${diff}px, 0)`,
    };
  });

  watch(
    () => props.data,
    async () => {
      await nextTick();
      calcHeight();
    }
  );
  watch(scrollY, (newY) => {
    const listHeiVal = listHeights.value;
    for (let i = 0; i < listHeiVal.length - 1; i++) {
      const heightTop = listHeiVal[i];
      const heightBottom = listHeiVal[i + 1];
      if (newY >= heightTop && newY <= heightBottom) {
        curIndex.value = i;
        distance.value = heightBottom - newY;
      }
    }
  });

  function calcHeight() {
    const list = groupRef.value.children;
    const listHeiVal = listHeights.value;
    let height = 0;

    listHeiVal.length = 0;
    listHeiVal.push(height);

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight;
      listHeiVal.push(height);
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y;
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    curIndex,
  };
}
