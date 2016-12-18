import { inViewport } from './geometry';
import { whichTransitionEvent } from './dom';

const transitionEnd = whichTransitionEvent();

function bindTransitionEndHandler(element, cb) {
  const transitionEndHandler = event => {
    cb(element);

    element.removeEventListener(transitionEnd, transitionEndHandler);
  };

  element.addEventListener(transitionEnd, transitionEndHandler);
}

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

    bindTransitionEndHandler(element, element => {
      element.style.zIndex = null;
      element.style.willChange = null;
      element.style.transition = null;
    });
  }
}

export function highlight(element, updated) {
  if (!updated) return;

  element.style.willChange = 'background-color';
  element.style.transition = null;
  element.style.backgroundColor = '#fc0';

  requestAnimationFrame(_ => {
    element.style.transition = 'background-color 5s';
    element.style.backgroundColor = null;
  });

  bindTransitionEndHandler(element, element => {
    element.style.willChange = null;
    element.style.transition = null;
  });
}
