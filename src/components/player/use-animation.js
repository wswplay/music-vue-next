import { ref } from "vue";
import creatAnimation from "create-keyframe-animation";

export default function useAnimation() {
  const cdWrapperRef = ref(null);

  function enter(el, done) {
    const { x, y, scale } = getPosAndScale();
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
      },
      100: {
        transform: "translate3d(0, 0, 0) scale(1)",
      },
    };

    creatAnimation.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 600,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
    });
    creatAnimation.runAnimation(cdWrapperRef.value, "move", done);
  }
  function afterEnter() {
    creatAnimation.unregisterAnimation("move");
    cdWrapperRef.value.animation = "";
  }
  function leave(el, done) {
    const { x, y, scale } = getPosAndScale();
    const cdWrapperEl = cdWrapperRef.value;

    cdWrapperEl.style.transition = "all 0.6s cubic-bezier(0.45, 0, 0.55, 1)";
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    cdWrapperEl.addEventListener("transitionend", next);

    function next() {
      cdWrapperEl.removeEventListener("transitionend", next);
      done();
    }
  }
  function afterLeave() {
    const cdWrapperEl = cdWrapperRef.value;
    cdWrapperEl.style.transition = "";
    cdWrapperEl.style.transform = "";
  }

  function getPosAndScale() {
    const targetWindth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;

    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    const scale = targetWindth / width;

    return { x, y, scale };
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave,
  };
}
