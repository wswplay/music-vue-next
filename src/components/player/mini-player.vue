<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="shouNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            ref="cdImageRef"
            :class="cdClass"
            width="40"
            height="40"
            :src="currentSong.pic"
          />
        </div>
      </div>
      <div>
        <h2 class="name">{{ currentSong.name }}</h2>
        <p class="desc">{{ currentSong.singer }}</p>
      </div>
      <div class="control">
        <ProgressCircle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </ProgressCircle>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import useCD from "./use-cd";
import ProgressCircle from "./progress-circle";

export default {
  name: "mini-player",
  components: { ProgressCircle },
  props: ["progress", "togglePlay"],
  setup() {
    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const miniPlayIcon = computed(() =>
      store.state.playing ? "icon-pause-mini" : "icon-play-mini"
    );

    const { cdRef, cdClass, cdImageRef } = useCD();

    function shouNormalPlayer() {
      store.commit("setFullScreen", true);
    }

    return {
      fullScreen,
      currentSong,
      shouNormalPlayer,
      miniPlayIcon,
      // cd
      cdRef,
      cdClass,
      cdImageRef,
    };
  },
};
</script>

<style lang="less" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: @color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .name {
    margin-bottom: 2px;
    .no-wrap();
    font-size: @font-size-medium;
    color: @color-text;
  }
  .desc {
    .no-wrap();
    font-size: @font-size-small;
    color: @color-text-d;
  }
  // .slider-wrapper {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   flex: 1;
  //   line-height: 20px;
  //   overflow: hidden;
  //   .slider-group {
  //     position: relative;
  //     overflow: hidden;
  //     white-space: nowrap;
  //     .slider-page {
  //       display: inline-block;
  //       width: 100%;
  //       transform: translate3d(0, 0, 0);
  //       backface-visibility: hidden;
  //       .name {
  //         margin-bottom: 2px;
  //         .no-wrap();
  //         font-size: @font-size-medium;
  //         color: @color-text;
  //       }
  //       .desc {
  //         .no-wrap();
  //         font-size: @font-size-small;
  //         color: @color-text-d;
  //       }
  //     }
  //   }
  // }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: @color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: @color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>