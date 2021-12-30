<template>
  <Header></Header>
  <Tab></Tab>
  <router-view />
</template>

<script>
import Header from "@/components/header/header";
import Tab from "@/components/tab/tab";

export default {
  name: "App",
  components: {
    Header,
    Tab,
  },
};
</script>

<style lang="less"></style>
