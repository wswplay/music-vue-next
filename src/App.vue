<template>
  <Header></Header>
  <Tab></Tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view name="user" :style="viewStyle" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
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
