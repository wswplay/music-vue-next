<template>
  <div ref="scrollRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroll from "./use-scroll";
import { ref } from "vue";

export default {
  name: "Scroll",
  props: {
    click: {
      type: Boolean,
      default: true,
    },
    probeType: {
      type: Number,
      default: 0,
    },
  },
  emits: ["scroll"],
  setup(props, { emit }) {
    const scrollRef = ref(null);
    const scroll = useScroll(scrollRef, props, emit);
    return {
      scrollRef,
      scroll,
    };
  },
};
</script>

<style lang="less" scoped></style>
