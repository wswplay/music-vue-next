<template>
  <div>singer</div>
</template>

<script>
import { getSingerList } from "@/service/singer";

export default {
  name: "singer",
  async created() {
    const result = await getSingerList();
    console.log("result", result);
  },
};
</script>

<style lang="less" scoped></style>
