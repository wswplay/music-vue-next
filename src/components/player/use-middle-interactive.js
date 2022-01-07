import { ref } from "vue";

export default function useMiddleInteractive() {
  const currentShow = ref("cd");
  const middleLstyle = ref(null);
  const middleRstyle = ref(null);

  const touch = {};
  let currentView = "cd";

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX;
  }
  function onMiddleTouchMove(e) {
    const distance = e.touches[0].pageX - touch.startX;
    const left = currentView === "cd" ? 0 : -window.innerWidth;
    const offsetWidth = Math.min(
      0,
      Math.max(-window.innerWidth, left + distance)
    );
    touch.percent = Math.abs(offsetWidth / window.innerWidth);
    if (currentView === "cd") {
      if (touch.percent > 0.2) {
        currentShow.value = "lyric";
      } else {
        currentShow.value = "cd";
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = "cd";
      } else {
        currentShow.value = "lyric";
      }
    }
    middleLstyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: "0ms",
    };
    middleRstyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: "0ms",
    };
  }
  function onMiddleTouchEnd() {
    let offsetWidth;
    let opacity;
    if (currentShow.value === "cd") {
      currentView = "cd";
      offsetWidth = 0;
      opacity = 1;
    } else {
      currentView = "lyric";
      offsetWidth = -window.innerWidth;
      opacity = 0;
    }

    const duration = 300;
    middleLstyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    };
    middleRstyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`,
    };
  }

  return {
    currentShow,
    middleLstyle,
    middleRstyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd,
  };
}
