<template>
  <Header></Header>
  <Tab></Tab>
  <router-view :style="viewStyle" />
  <Player></Player>
</template>

<script>
import Header from "@/components/header/header";
import Tab from "@/components/tab/tab";
import Player from "@/components/player/player";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    Header,
    Tab,
    Player,
  },
  computed: {
    ...mapState(["playList"]),
    viewStyle() {
      const bottom = this.playList.length ? "60px" : "0";
      return {
        bottom,
      };
    },
  },
};
</script>

<style lang="less"></style>
