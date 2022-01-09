import MusicList from "@/components/music-list/music-list";
import storage from "good-storage";
import { processSongs } from "@/service/song.js";

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList,
    },
    props: {
      itemInfo: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
      };
    },
    computed: {
      curInfo() {
        let info = null;
        const tempInfo = this.itemInfo;
        if (tempInfo) {
          info = tempInfo;
        } else {
          const cachedInfo = storage.session.get(key);
          if (
            cachedInfo &&
            String(cachedInfo.mid || cachedInfo.id) === this.$route.params.id
          ) {
            info = cachedInfo;
          }
        }
        return info;
      },
      title() {
        const tempInfo = this.curInfo;
        return (tempInfo && (tempInfo.name || tempInfo.title)) || "";
      },
      pic() {
        const tempInfo = this.curInfo;
        return (tempInfo && tempInfo.pic) || "";
      },
    },
    async created() {
      const tempInfo = this.curInfo;
      if (!tempInfo || (!tempInfo.id && !tempInfo.mid)) {
        const path = this.$route.matched[0].path;
        this.$router.push(path);
        return;
      }
      const result = await fetch(tempInfo);
      this.songs = await processSongs(result.songs);
      this.loading = false;
    },
  };
}
