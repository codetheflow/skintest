
export function eventPath(event: MouseEvent): EventTarget[] {
  const path = (event.composedPath && event.composedPath()) || (event as any).path;
  const target = event.target;

  if (path) {
    // safari doesn't include window, but it should
    return (path.indexOf(window) < 0) ? path.concat(window) : path;
  }

  if (target === window) {
    return [window];
  }

  return [target].concat(parents(target), window);
}

function parents(element: EventTarget) {
  const path = [];
  while (element) {
    path.unshift(element);
    element = (element as Node).parentNode;
  }

  return path;
}