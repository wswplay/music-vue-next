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
      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
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
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"></i>
      </div>
      <PlayList ref="playListRef"></PlayList>
    </div>
  </transition>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import useCD from "./use-cd";
import useMiniSlider from "./use-mini-slider";
import ProgressCircle from "./progress-circle";
import PlayList from "./playlist";

export default {
  name: "mini-player",
  components: { ProgressCircle, PlayList },
  props: ["progress", "togglePlay"],
  setup() {
    const playListRef = ref(null);

    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const miniPlayIcon = computed(() =>
      store.state.playing ? "icon-pause-mini" : "icon-play-mini"
    );
    const playList = computed(() => store.state.playList);

    const { cdRef, cdClass, cdImageRef } = useCD();
    const { sliderWrapperRef } = useMiniSlider();

    function shouNormalPlayer() {
      store.commit("setFullScreen", true);
    }
    function showPlayList() {
      playListRef.value.show();
    }

    return {
      fullScreen,
      currentSong,
      shouNormalPlayer,
      miniPlayIcon,
      playList,
      playListRef,
      showPlayList,
      // cd
      cdRef,
      cdClass,
      cdImageRef,
      // mini-slider
      sliderWrapperRef,
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
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
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
      }
    }
  }
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
