<template>
  <div class="recommend">
    <Slider></Slider>
  </div>
</template>

<script>
import { getRecommend } from "@/service/recommend";
import Slider from "@/components/base/slider/slider";

export default {
  name: "recommend",
  components: {
    Slider,
  },
  async created() {
    const result = await getRecommend();
    console.log(result);
  },
};
</script>

<style lang="less" scoped></style>
