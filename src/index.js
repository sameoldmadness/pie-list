import { $, $$, updateList } from './dom';
import { getBoundaries, getViewportBoundaries } from './geometry';
import { translate } from './animation';

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
