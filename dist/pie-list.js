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

const translate = {
  invert(element, delta) {
    element.style.willChange = 'transform';
    element.style.transition = null;
    element.style.transform = `translateY(${delta}px)`;
  },

  play(element) {
    element.style.transition = 'transform 2s';
    element.style.transform = null;
  },
};

const {invert, play} = translate;

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
    const last = getBoundaries(this.elements);
    const viewport = getViewportBoundaries(this._viewport);

    this.elements.forEach(this._animateElement.bind(this, first, last, viewport));
  }

  _animateElement(first, last, viewport, element) {
    const id = Number(element.dataset.id);

    if (!first[id]) return;
    if (!inViewport(first[id], viewport)) return;

    const delta = first[id].top - last[id].top;

    if (delta) {
      invert(element, delta);
      requestAnimationFrame(_ => play(element));
    }
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
