<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" v-show="songs.length" :style="playBtnStyle">
        <div class="play-btn" @click="randomPlay(songs)">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-noResult:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from "@/components/base/song-list/song-list";
import Scroll from "@/components/wrap-scroll";
import { mapActions, mapState } from "vuex";

const RESERVED_HEIGHT = 40;

export default {
  name: "music-list",
  components: {
    SongList,
    Scroll,
  },
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: "毫无，歌曲",
    },
    rank: Boolean,
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
    };
  },
  computed: {
    ...mapState(["playList"]),
    noResult() {
      return !this.loading && !this.songs.length;
    },
    playBtnStyle() {
      let display = "";
      if (this.scrollY >= this.maxTranslateY) {
        display = "none";
      }
      return {
        display,
      };
    },
    bgImageStyle() {
      const scrollY = this.scrollY;
      let zIndex = 0;
      let paddingTop = "100%";
      let height = 0;
      // 兼容iPhone
      let translateZ = 0;
      // 图片放大功能
      let scale = 1;
      if (scrollY > this.maxTranslateY) {
        zIndex = 10;
        paddingTop = 0;
        height = `${RESERVED_HEIGHT}px`;
        translateZ = 1;
      }
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight);
      }

      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`,
      };
    },
    scrollStyle() {
      let bottom = this.playList.length ? "60px" : "0";
      return {
        top: `${this.imageHeight}px`,
        bottom,
      };
    },
    filterStyle() {
      let blur = 0;
      const scrollY = this.scrollY;
      const imgH = this.imageHeight;
      if (scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / imgH, scrollY / imgH) * 20;
      }
      return {
        backdropFilter: `blur(${blur}px)`,
      };
    },
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT;
  },
  methods: {
    ...mapActions(["randomPlay", "selectPlay"]),
    goBack() {
      this.$router.back();
    },
    onScroll(pos) {
      this.scrollY = -pos.y;
    },
    selectItem({ index }) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    .no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: @font-size-large;
    color: @color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid @color-theme;
        color: @color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: @font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: @color-background;
    }
  }
}
</style>
