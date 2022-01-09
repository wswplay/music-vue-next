<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-noResult:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { nextTick, watch } from "@vue/runtime-core";
import { search } from "@/service/search";
import { processSongs } from "@/service/song";
import usePullUpLoad from "./use-pull-up-load";

export default {
  name: "suggest",
  props: {
    query: String,
    showSinger: Boolean,
  },
  setup(props) {
    const singer = ref(null);
    const songs = ref([]);
    const hasMore = ref(true);
    const page = ref(1);
    const loadingText = ref("");
    const noResultText = ref("毫无，搜索结果");

    const { rootRef, isLoading, scroll } = usePullUpLoad(searchMore);

    const loading = computed(() => !singer.value && !songs.value.length);
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value;
    });
    const pullUpLoading = computed(() => isLoading.value && hasMore.value);

    watch(
      () => props.query,
      (val) => {
        if (!val) return;
        searchFirst();
      }
    );

    async function searchFirst() {
      singer.value = null;
      songs.value = [];
      hasMore.value = true;
      page.value = 1;

      const result = await search(props.query, page.value, props.showSinger);
      songs.value = await processSongs(result.songs);
      singer.value = result.singer;
      hasMore.value = result.hasMore;
      await nextTick();
      await makeScrollable();
    }

    async function searchMore() {
      if (!hasMore.value) return;
      page.value++;
      const result = await search(props.query, page.value, props.showSinger);
      songs.value = songs.value.concat(await processSongs(result.songs));
      hasMore.value = result.hasMore;
      await nextTick();
      await makeScrollable();
    }

    async function makeScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        await searchMore();
      }
    }

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText,
      pullUpLoading,
      // pull-up
      rootRef,
      isLoading,
    };
  },
};
</script>

<style lang="less" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: @color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text {
          .no-wrap();
        }
      }
    }
  }
}
</style>
