<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)"
    >
      <div v-if="rank" class="rank">
        <span :class="getRankClass(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "song-list",
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    rank: Boolean,
  },
  emits: ["select"],
  methods: {
    ...mapActions(["selectPlay"]),
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    selectItem(song, index) {
      this.$emit("select", { song, index });
    },
    getRankClass(index) {
      if (index <= 2) return `icon icon${index}`;
      return "text";
    },
    getRankText(index) {
      if (index > 2) return index + 1;
    },
  },
};
</script>

<style lang="less" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: @font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          .bg-image("first");
        }
        &.icon1 {
          .bg-image("second");
        }
        &.icon2 {
          .bg-image("third");
        }
      }
      .text {
        color: @color-theme;
        font-size: @font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        .no-wrap();
        color: @color-text;
      }
      .desc {
        .no-wrap();
        margin-top: 4px;
        color: @color-text-d;
      }
    }
  }
}
</style>
