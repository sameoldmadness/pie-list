import { $, $$, updateList } from './dom';
import { getBoundaries, getViewportBoundaries } from './geometry';
import { translate, highlight } from './animation';

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
    this._markUpdated(items);

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
    const updated = Boolean(element.dataset.updated);

    translate(element, first[id], last[id], viewport, index, elements.length);

    // highlight(element.querySelector('.content'), updated);
  }

  _createElement(item) {
    const element = document.createElement('div');
    const content = document.createElement('div');

    element.setAttribute('data-id', item.id);
    item.updated && element.setAttribute('data-updated', true);
    element.classList.add('item');

    content.textContent = item.id;
    content.classList.add('content');

    element.appendChild(content);

    return element;
  }

  _markUpdated(items) {
    const prevIndices = this._items.reduce((indices, { id }, index) => {
      indices[id] = index;

      return indices;
    }, {});

    items.forEach((item, index) => {
      item.updated = index < prevIndices[item.id];
    });
  }
}
