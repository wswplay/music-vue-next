import { computed, nextTick, ref, watch } from "vue";

export default function useFixed(props) {
  const groupRef = ref(null);
  const listHeights = ref([]);
  const scrollY = ref(0);
  const curIndex = ref(0);

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) return "";
    const curGroup = props.data[curIndex.value];
    return (curGroup && curGroup.title) || "";
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
  };
}
