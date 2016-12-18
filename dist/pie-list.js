(function (exports) {
'use strict';

const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

function updateList(list, items, createElement) {
  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const element = createElement(item);

    fragment.appendChild(element);
  });

  list.textContent = '';
  list.appendChild(fragment);
}

// Modified from Modernizr
function whichTransitionEvent() {
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  };

  // If we're running in a browserless environment (eg. SSR), it doesn't apply.
  // Return a placeholder string, for consistent type return.
  if (typeof document === 'undefined') return '';

  const el = document.createElement('fakeelement');

  const match = Object.keys(transitions).find(t => (
    el.style[t] !== undefined
  ));

  // If no `transition` is found, we must be running in a browser so ancient,
  // React itself won't run. Return an empty string, for consistent type return
  return match ? transitions[match] : '';
}

function getViewportBoundaries(viewport) {
  const { top } = viewport.getBoundingClientRect();
  const { clientHeight: height } = viewport;

  return { top, bottom: top + height };
}

function getBoundaries(items) {
  return items.reduce((boundaries, item) => {
    const { id } = item.dataset;
    const { top, bottom } = item.getBoundingClientRect();

    return Object.assign(boundaries, { [id]: { top, bottom }});
  }, {});
}

function inViewport(item, viewport) {
  return item.bottom >= viewport.top && item.top <= viewport.bottom;
}

const transitionEnd = whichTransitionEvent();

function bindTransitionEndHandler(element) {
  const transitionEndHandler = event => {
    element.style.zIndex = null;
    element.style.willChange = null;
    element.style.transition = null;

    element.removeEventListener(transitionEnd, transitionEndHandler);
  };

  element.addEventListener(transitionEnd, transitionEndHandler);
}

function translate(element, first, last, viewport, index, len) {
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

    bindTransitionEndHandler(element);
  }
}

class List {
  constructor(container, viewport = document.documentElement) {
    this._container = container;
    this._viewport = viewport;
    this._items = [];
  }

  get elements() {
    return $$('.item', this._container);
  }

  set items(items) {
    this._updateList(items);
    this._items = items;
  }

  _updateList(items) {
    const first = getBoundaries(this.elements);
    updateList(this._container, items, this._createElement);
    const elements = this.elements;
    const last = getBoundaries(elements);
    const viewport = getViewportBoundaries(this._viewport);

    elements.forEach(this._animateElement.bind(this, first, last, viewport));
    elements[0].getBoundingClientRect(); // force recalculate style
  }

  _animateElement(first, last, viewport, element, index, elements) {
    const id = Number(element.dataset.id);

    translate(element, first[id], last[id], viewport, index, elements.length);
  }

  _createElement(item) {
    const element = document.createElement('div');

    element.textContent = item.id;
    element.setAttribute('data-id', item.id);
    element.classList.add('item');

    return element;
  }
}

exports.List = List;

}((this.PIE = this.PIE || {})));
