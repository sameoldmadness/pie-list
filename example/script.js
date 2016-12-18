const items = [
  '0123456789',
  '0234567891',
  '0912345678',
  '0321456789',
  '0243567891',
].map(xs => xs.split('').map(x => ({ id: +x })));

const { List } = window.PIE;
const buttonsPane = document.querySelector('aside');
const container = document.querySelector('.list');

const list = new List(container);

list.items = items[0];

buttonsPane.addEventListener('click', event => {
  if (event.target instanceof HTMLButtonElement) {
    const id = Number(event.target.textContent);

    if (!isNaN(id)) {
      list.items = items[id];
    }
  }
});
