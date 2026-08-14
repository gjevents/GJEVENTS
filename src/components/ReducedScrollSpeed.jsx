import { useEffect } from "react";

const SCROLL_SPEED = 0.45;

const isScrollableElement = (element) => {
  if (!element || element === document.body || element === document.documentElement) return false;

  const style = window.getComputedStyle(element);
  const canScrollY = /(auto|scroll)/.test(style.overflowY);
  return canScrollY && element.scrollHeight > element.clientHeight;
};

const shouldUseNativeScroll = (target) => {
  if (!(target instanceof Element)) return true;
  if (target.closest("input, textarea, select, [contenteditable='true']")) return true;
  if (target.closest("[data-native-scroll]")) return true;

  let element = target;
  while (element && element !== document.body) {
    if (isScrollableElement(element)) return true;
    element = element.parentElement;
  }

  return false;
};

export default function ReducedScrollSpeed() {
  useEffect(() => {
    if (window.__gjReducedScrollSpeedLoaded) return undefined;
    window.__gjReducedScrollSpeedLoaded = true;

    const onWheel = (event) => {
      if (event.defaultPrevented || event.ctrlKey || shouldUseNativeScroll(event.target)) return;

      event.preventDefault();
      window.scrollBy({
        top: event.deltaY * SCROLL_SPEED,
        left: event.deltaX * SCROLL_SPEED,
        behavior: "auto",
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return null;
}
