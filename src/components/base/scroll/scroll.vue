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
  },
  setup(props) {
    const scrollRef = ref(null);
    useScroll(scrollRef, props);
    return {
      scrollRef,
    };
  },
};
</script>

<style lang="less" scoped></style>
