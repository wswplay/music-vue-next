<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart="onMiddleTouchStart"
          @touchmove="onMiddleTouchMove"
          @touchend="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLstyle">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdClass"
                  :src="currentSong.pic"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRstyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formateTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <ProgressBar
                ref="barRef"
                :progress="progress"
                @progressMove="progressMove"
                @progressEnd="progressEnd"
              ></ProgressBar>
            </div>
            <span class="time time-r">{{
              formateTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <MiniPlayer :progress="progress" :togglePlay="togglePlay"></MiniPlayer>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="readyPlay"
      @error="error"
      @timeupdate="updateTime"
      @ended="endPlay"
    ></audio>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { nextTick, watch } from "@vue/runtime-core";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCD from "./use-cd";
import useLyric from "./use-lyric";
import useMiddleInteractive from "./use-middle-interactive";
import useAnimation from "./use-animation";
import usePlayHistory from "./use-play-history";
import ProgressBar from "./progress-bar";
import Scroll from "@/components/base/scroll/scroll";
import MiniPlayer from "./mini-player.vue";
import { formateTime } from "@/assets/js/util";
import { PLAY_MODE } from "@/assets/js/constant";

export default {
  name: "player",
  components: { ProgressBar, Scroll, MiniPlayer },
  setup() {
    const audioRef = ref(null);
    const barRef = ref(null);
    let isReady = ref(false);
    const currentTime = ref(0);
    let progressChanging = false;

    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.state.playing);
    const curIndex = computed(() => store.state.curIndex);
    const playList = computed(() => store.state.playList);
    const playMode = computed(() => store.state.playMode);

    const { modeIcon, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();
    const { cdClass, cdRef, cdImageRef } = useCD();
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      playLyric,
      stopLyric,
      pureMusicLyric,
      playingLyric,
    } = useLyric({
      isReady,
      currentTime,
    });
    const {
      currentShow,
      middleLstyle,
      middleRstyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useMiddleInteractive();
    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } =
      useAnimation();

    const { savePlay } = usePlayHistory();

    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });
    const disableClass = computed(() => {
      return isReady.value ? "" : "disable";
    });
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) return;
      currentTime.value = 0;
      isReady.value = false;
      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      store.commit("setPlayingState", true);
    });
    watch(playing, (newPlaying) => {
      if (!isReady.value) return;
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
        playLyric();
      } else {
        audioEl.pause();
        stopLyric();
      }
    });
    watch(fullScreen, async (val) => {
      if (val) {
        await nextTick();
        barRef.value.setOffset(progress.value);
      }
    });

    function goBack() {
      store.commit("setFullScreen", false);
    }
    function togglePlay() {
      if (!isReady.value) return;
      store.commit("setPlayingState", !playing.value);
    }
    function pause() {
      store.commit("setPlayingState", false);
    }
    function prev() {
      const listLen = playList.value.length;
      if (!isReady.value || !listLen) return;
      if (listLen === 1) {
        loop();
      } else {
        let index = curIndex.value - 1;
        if (index === -1) {
          index = listLen - 1;
        }
        store.commit("setCurIndex", index);
      }
    }
    function next() {
      const listLen = playList.value.length;
      if (!isReady.value || !listLen) return;
      if (listLen === 1) {
        loop();
      } else {
        let index = curIndex.value + 1;
        if (index === listLen) {
          index = 0;
        }
        store.commit("setCurIndex", index);
      }
    }
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.commit("setPlayingState", true);
    }
    function readyPlay() {
      if (isReady.value) return;
      isReady.value = true;
      playLyric();
      savePlay(currentSong.value);
    }
    function error() {
      isReady.value = true;
    }
    function updateTime(e) {
      if (progressChanging) return;
      currentTime.value = e.target.currentTime;
    }
    function progressMove(rate) {
      progressChanging = true;
      currentTime.value = currentSong.value.duration * rate;
      playLyric();
      stopLyric();
    }
    function progressEnd(rate) {
      progressChanging = false;
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * rate;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
    }
    function endPlay() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }

    return {
      audioRef,
      barRef,
      fullScreen,
      currentSong,
      playList,
      playIcon,
      isReady,
      disableClass,
      currentTime,
      progress,
      // method
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      readyPlay,
      error,
      // use-mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      updateTime,
      formateTime,
      progressMove,
      progressEnd,
      endPlay,
      // cd
      cdClass,
      cdRef,
      cdImageRef,
      // lyric
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      // middle
      currentShow,
      middleLstyle,
      middleRstyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // animation
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
    };
  },
};
</script>

<style lang="less" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: @font-size-large-x;
        color: @color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        .no-wrap();
        font-size: @font-size-large;
        color: @color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current {
              color: @color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: @color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: @color-text;
          font-size: @font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: @color-theme;
          &.disable {
            color: @color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: @color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
