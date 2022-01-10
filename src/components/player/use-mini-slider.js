import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

BScroll.use(Slide);

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null);
  const slider = ref(null);

  const store = useStore();
  const fullScreen = computed(() => store.state.fullScreen);
  const playList = computed(() => store.state.playList);
  const sliderShow = computed(() => !fullScreen.value && !!playList.value);
  const currentIndex = computed(() => store.state.curIndex);

  onMounted(() => {
    let sliderVal;
    watch(sliderShow, async (val) => {
      if (val) {
        await nextTick();
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });
          sliderVal.on("slidePageChanged", ({ pageX }) => {
            store.commit("setCurIndex", pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (val) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(val, 0, 0);
      }
    });
    watch(playList, async (val) => {
      if (sliderVal && sliderShow.value && val.length) {
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy();
    }
  });

  onActivated(() => {
    slider.value.enable();
    slider.value.refresh();
  });
  onDeactivated(() => {
    slider.value.disable();
  });

  return {
    slider,
    sliderWrapperRef,
  };
}
