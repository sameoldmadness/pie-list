import { inViewport } from './geometry';

export function translate(element, first, last, viewport, index, len) {
  element.style.zIndex = null;

  if (!first) return;
  if (!inViewport(first, viewport)) return;

  const delta = first.top - last.top;

  if (delta) {
    const maxZIndex = len;
    const zIndex = maxZIndex - index;

    element.style.zIndex = zIndex;

    element.style.willChange = 'transform';
    element.style.transition = null;
    element.style.transform = `translateY(${delta}px)`;

    requestAnimationFrame(_ => {
      element.style.transition = 'transform 2s';
      element.style.transform = null;
    });
  }
}
