import { createApp } from "vue";
import Loading from "./loading.vue";
import { addClass, removeClass } from "@/assets/js/dom";

const relativeClass = "g-relative";

const loadingDirective = {
  mounted(el, binding) {
    const instance = createApp(Loading).mount(document.createElement("div"));
    el.instance = instance;
    const title = binding.arg;
    if (typeof title !== "undefined") {
      instance.setTitle(title);
    }
    if (binding.value) {
      append(el);
    }
  },
  updated(el, binding) {
    const title = binding.arg;
    if (typeof title !== "undefined") {
      el.instance.setTitle(title);
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el);
    }
  },
};

function append(el) {
  const positionList = ["relative", "absolute", "fixed"];
  const style = getComputedStyle(el);
  if (!positionList.includes(style.position)) {
    addClass(el, relativeClass);
  }
  el.appendChild(el.instance.$el);
}
function remove(el) {
  removeClass(el, relativeClass);
  el.removeChild(el.instance.$el);
}

export default loadingDirective;
