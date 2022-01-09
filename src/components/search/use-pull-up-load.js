import BScroll from "@better-scroll/core";
import PullUp from "@better-scroll/pull-up";
import ObserveDOM from "@better-scroll/observe-dom";
import { onMounted, onUnmounted, ref } from "vue";

BScroll.use(PullUp);
BScroll.use(ObserveDOM);

export default function usePullUpLoad(fetchData) {
  const scroll = ref(null);
  const rootRef = ref(rootRef);
  const isLoading = ref(false);

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true,
    }));

    scrollVal.on("pullingUp", pullingUpHandle);

    async function pullingUpHandle() {
      isLoading.value = true;
      await fetchData();
      scrollVal.finishPullUp();
      scrollVal.refresh();
      isLoading.value = false;
    }
  });

  onUnmounted(() => {
    scroll.value.destroy();
  });

  return {
    scroll,
    rootRef,
    isLoading,
  };
}
