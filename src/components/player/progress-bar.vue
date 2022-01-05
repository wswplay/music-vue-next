<template>
  <div class="progress-bar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const processBtnWidth = 16;

export default {
  name: "progress-bar",
  props: {
    progress: {
      type: Number,
      defaule: 0,
    },
  },
  emits: ["progressMove", "progressEnd"],
  data() {
    return {
      offset: 0,
    };
  },
  computed: {
    progressStyle() {
      return `width:${this.offset}px`;
    },
    btnStyle() {
      return `transform: translate3d(${this.offset}px, 0, 0)`;
    },
  },
  watch: {
    progress(newVal) {
      const barWidth = this.$el.clientWidth - processBtnWidth;
      this.offset = barWidth * newVal;
    },
  },
  created() {
    this.touch = {};
  },
  methods: {
    onTouchStart(e) {
      this.touch.x1 = e.touches[0].pageX;
      this.touch.beginWidth = this.$refs.progress.clientWidth;
    },
    onTouchMove(e) {
      const distance = e.touches[0].pageX - this.touch.x1;
      const tempWidth = this.touch.beginWidth + distance;
      const barWidth = this.$el.clientWidth - processBtnWidth;
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
      this.offset = barWidth * progress;
      this.$emit("progressMove", progress);
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - processBtnWidth;
      const progress = this.$refs.progress.clientWidth / barWidth;
      this.$emit("progressEnd", progress);
    },
    progressClick(e) {
      const rect = this.$el.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      const barWidth = this.$el.clientWidth - processBtnWidth;
      const progress = offsetWidth / barWidth;
      this.$emit("progressEnd", progress);
    },
  },
};
</script>

<style lang="less" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }
    }
  }
}
</style>
