<template>
  <div class="search">
    <div class="search-input-wrapper">
      <SearchInput v-model="query"></SearchInput>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
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
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <Confirm
            ref="confirmRef"
            text="清空，所有搜索历史？"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          ></Confirm>
          <SearchList
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></SearchList>
        </div>
      </div>
    </scroll>
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
import { computed, ref } from "@vue/reactivity";
import { nextTick, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import storage from "good-storage";

import { getHotKeys } from "@/service/search";
import { SINGER_KEY } from "@/assets/js/constant";
import useSearchHistory from "@/components/search/use-search-history";
import SearchInput from "@/components/search/search-input";
import Suggest from "@/components/search/suggest";
import SearchList from "@/components/base/search-list/search-list";
import Scroll from "@/components/wrap-scroll";
import Confirm from "@/components/base/confirm/confirm";

export default {
  name: "search",
  components: { SearchInput, Suggest, SearchList, Scroll, Confirm },
  setup() {
    const store = useStore();
    const router = useRouter();

    const query = ref("");
    const hotKeys = ref([]);
    const singerInfo = ref(null);
    const scrollRef = ref(null);
    const confirmRef = ref(null);

    const searchHistory = computed(() => store.state.searchHistory);

    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory();

    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys;
    });

    watch(query, async (val) => {
      if (!val) {
        await nextTick();
        refreshScroll();
      }
    });

    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }

    function addQuery(key) {
      query.value = key;
    }

    function selectSong(song) {
      saveSearch(query.value);
      store.dispatch("addSong", song);
    }
    function selectSinger(singer) {
      saveSearch(query.value);
      singerInfo.value = singer;
      storage.session.set(SINGER_KEY, singer);
      router.push(`/search/${singer.mid}`);
    }
    function showConfirm() {
      confirmRef.value.show();
    }

    return {
      scrollRef,
      confirmRef,
      query,
      hotKeys,
      addQuery,
      selectSong,
      singerInfo,
      selectSinger,
      searchHistory,
      deleteSearch,
      showConfirm,
      clearSearch,
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
