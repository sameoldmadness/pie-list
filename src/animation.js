export const translate = {
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
