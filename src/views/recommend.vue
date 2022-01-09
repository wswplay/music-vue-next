<template>
  <div class="recommend" v-loading:[loadingTitle]="loading">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider v-if="sliders.length" :sliders="sliders"></Slider>
          </div>
        </div>
        <div class="recommend-list" v-show="!loading">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectAlbum(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :itemInfo="itemInfo" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from "@/service/recommend";
import Slider from "@/components/base/slider/slider";
import Scroll from "@/components/wrap-scroll";
import storage from "good-storage";
import { ALBUM_KEY } from "@/assets/js/constant";

export default {
  name: "recommend",
  components: {
    Slider,
    Scroll,
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length;
    },
  },
  data() {
    return {
      sliders: [],
      albums: [],
      loadingTitle: "看，灰机...",
      itemInfo: null,
    };
  },
  async created() {
    const result = await getRecommend();
    this.sliders = result.sliders;
    this.albums = result.albums;
  },
  methods: {
    selectAlbum(item) {
      this.itemInfo = item;
      this.cacheAlbum();
      this.$router.push(`/recommend/${item.id}`);
    },
    cacheAlbum() {
      storage.session.set(ALBUM_KEY, this.itemInfo);
    },
  },
};
</script>

<style lang="less" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: @font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: @color-text;
        }
        .title {
          color: @color-text-d;
        }
      }
    }
  }
}
</style>
