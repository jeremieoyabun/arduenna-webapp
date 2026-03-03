import { useRef, useState } from "react";

/**
 * Pointer-based swipe gesture hook.
 * Works on touch + mouse. Returns drag offset + event handlers.
 */
export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 55 }) {
  const startX = useRef(null);
  const dragging = useRef(false);
  const [dragX, setDragX] = useState(0);

  function onPointerDown(e) {
    startX.current = e.clientX;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging.current || startX.current === null) return;
    setDragX(e.clientX - startX.current);
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    const delta = dragX;
    setDragX(0);
    startX.current = null;
    if (delta < -threshold) onSwipeLeft?.();
    else if (delta > threshold) onSwipeRight?.();
  }

  return { dragX, onPointerDown, onPointerMove, onPointerUp };
}
