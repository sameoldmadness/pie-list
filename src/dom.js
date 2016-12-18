export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

export function updateList(list, items, createElement) {
  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const element = createElement(item);

    fragment.appendChild(element);
  });

  list.textContent = '';
  list.appendChild(fragment);
}
