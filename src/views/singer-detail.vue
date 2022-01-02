<template>
  <div class="singer-detail">
    <MusicList
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></MusicList>
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer";
import { processSongs } from "@/service/song.js";
import MusicList from "@/components/music-list/music-list";

export default {
  name: "singer-detail",
  components: {
    MusicList,
  },
  props: {
    singerInfo: Object,
  },
  data() {
    return {
      songs: [],
      loading: true,
    };
  },
  computed: {
    title() {
      return (this.singerInfo && this.singerInfo.name) || "";
    },
    pic() {
      return (this.singerInfo && this.singerInfo.pic) || "";
    },
  },
  async created() {
    const result = await getSingerDetail(this.singerInfo);
    this.songs = await processSongs(result.songs);
    this.loading = false;
  },
};
</script>

<style lang="less" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: @color-background;
}
</style>
