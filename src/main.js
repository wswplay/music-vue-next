import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import lazyPlugin from "vue3-lazy";
import loadingDirective from "@/components/base/loading/directive";
import noResultDirective from "@/components/base/no-result/directive";

import { loadStorage, saveAll } from "@/assets/js/array-store";
import { FAVORITE_KEY, PLAY_KEY } from "@/assets/js/constant";
import { processSongs } from "@/service/song";

// 引入全局样式
import "@/assets/style/index.less";

// 更新本地缓存歌曲的url
const favoriteSongs = loadStorage(FAVORITE_KEY);
if (favoriteSongs.length) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit("setFavoriteList", songs);
    saveAll(FAVORITE_KEY, songs);
  });
}
const historySongs = loadStorage(PLAY_KEY);
if (historySongs.length) {
  processSongs(historySongs).then((songs) => {
    store.commit("setPlayHistory", songs);
    saveAll(PLAY_KEY, songs);
  });
}

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    loading: require("@/assets/images/default.png"),
  })
  .directive("loading", loadingDirective)
  .directive("noResult", noResultDirective)
  .mount("#app");
