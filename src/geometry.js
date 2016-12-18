export function getViewportBoundaries(viewport) {
  const { top } = viewport.getBoundingClientRect();
  const { clientHeight: height } = viewport;

  return { top, bottom: top + height };
}

export function getBoundaries(items) {
  return items.reduce((boundaries, item) => {
    const { id } = item.dataset;
    const { top, bottom } = item.getBoundingClientRect();

    return Object.assign(boundaries, { [id]: { top, bottom }});
  }, {});
}

export function inViewport(item, viewport) {
  return item.bottom >= viewport.top && item.top <= viewport.bottom;
}
