<template>
  <Header></Header>
  <Tab></Tab>
  <router-view />
  <Player></Player>
</template>

<script>
import Header from "@/components/header/header";
import Tab from "@/components/tab/tab";
import Player from "@/components/player/player";

export default {
  name: "App",
  components: {
    Header,
    Tab,
    Player,
  },
};
</script>

<style lang="less"></style>
