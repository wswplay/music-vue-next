<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @selectSinger="selectSinger"></IndexList>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :itemInfo="singerInfo" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from "@/service/singer";
import IndexList from "@/components/index-list/index-list";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant.js";

export default {
  name: "singer",
  components: {
    IndexList,
  },
  data() {
    return {
      singers: [],
      singerInfo: null,
    };
  },
  async created() {
    const result = await getSingerList();
    this.singers = result.singers;
  },
  methods: {
    selectSinger(info) {
      this.singerInfo = info;
      storage.session.set(SINGER_KEY, info);
      this.$router.push({
        path: `/singer/${info.mid}`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
