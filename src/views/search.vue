<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query"></SearchInput>
    </div>
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            class="item"
            v-for="item in hotKeys"
            :key="item.id"
            @click="addQuery(item.key)"
          >
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <Suggest
        :query="query"
        @selectSong="selectSong"
        @selectSinger="selectSinger"
      ></Suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :itemInfo="singerInfo" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from "@/components/search/search-input";
import Suggest from "@/components/search/suggest";
import { ref } from "@vue/reactivity";
import { getHotKeys } from "@/service/search";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";

export default {
  name: "search",
  components: { SearchInput, Suggest },
  setup() {
    const store = useStore();
    const router = useRouter();

    const query = ref("");
    const hotKeys = ref([]);
    const singerInfo = ref(null);

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys;
    });

    function addQuery(key) {
      query.value = key;
    }

    function selectSong(song) {
      store.dispatch("addSong", song);
    }
    function selectSinger(singer) {
      singerInfo.value = singer;
      storage.session.set(SINGER_KEY, singer);
      router.push(`/search/${singer.mid}`);
    }

    return {
      query,
      hotKeys,
      addQuery,
      selectSong,
      singerInfo,
      selectSinger,
    };
  },
};
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: @font-size-medium;
        color: @color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: @color-highlight-background;
        font-size: @font-size-medium;
        color: @color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: @font-size-medium;
        color: @color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          .extend-click();
          .icon-clear {
            font-size: @font-size-medium;
            color: @color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
