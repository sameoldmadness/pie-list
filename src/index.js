import { $, $$, updateList } from './dom';
import { getBoundaries, getViewportBoundaries, inViewport } from './geometry';
import { translate } from './animation';

const {invert, play} = translate;

export class List {
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
    this.elements[0].getBoundingClientRect();
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
