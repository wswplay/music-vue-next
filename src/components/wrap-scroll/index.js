import Scorll from "@/components/base/scroll/scroll";
import {
  computed,
  h,
  mergeProps,
  nextTick,
  ref,
  renderSlot,
  watch,
  withCtx,
} from "vue";
import { useStore } from "vuex";

export default {
  name: "wrap-scroll",
  props: Scorll.props,
  emits: Scorll.emits,
  render(ctx) {
    return h(
      Scorll,
      mergeProps({ ref: "scrollRef" }, ctx.$props, {
        onScroll: (e) => {
          ctx.$emit("scroll", e);
        },
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, "default")];
        }),
      }
    );
  },
  setup() {
    const scrollRef = ref(null);
    const scroll = computed(() => scrollRef.value.scroll);

    const store = useStore();
    const playList = computed(() => store.state.playList);

    watch(playList, async () => {
      await nextTick();
      scroll.value.refresh();
    });

    return {
      scrollRef,
      scroll,
    };
  },
};
