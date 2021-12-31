import { createApp } from "vue";
import Loading from "./loading.vue";

const loadingDirective = {
  mounted(el, binding) {
    const instance = createApp(Loading).mount(document.createElement("div"));
    el.instance = instance;
    if (binding.value) {
      append(el);
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el);
    }
  },
};

function append(el) {
  el.appendChild(el.instance.$el);
}
function remove(el) {
  el.removeChild(el.instance.$el);
}

export default loadingDirective;
