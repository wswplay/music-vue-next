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
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant.js";

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
    curInfo() {
      let info = null;
      const singer = this.singerInfo;
      if (singer) {
        info = singer;
      } else {
        const cachedInfo = storage.session.get(SINGER_KEY);
        if (cachedInfo && cachedInfo.mid === this.$route.params.id) {
          info = cachedInfo;
        }
      }
      return info;
    },
    title() {
      const curSinger = this.curInfo;
      return (curSinger && curSinger.name) || "";
    },
    pic() {
      const curSinger = this.curInfo;
      return (curSinger && curSinger.pic) || "";
    },
  },
  async created() {
    if (!this.curInfo || !this.curInfo.mid) {
      const path = this.$route.matched[0].path;
      this.$router.push(path);
      return;
    }
    const result = await getSingerDetail(this.curInfo);
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
