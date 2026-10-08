function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!['http:', 'https:'].includes(location.protocol)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

function init() {
  document.addEventListener('click', handleClick);
  document.addEventListener('change', handleChange);
  registerServiceWorker();
  window.matchMedia?.(NARROW_SCREEN_QUERY).addEventListener?.('change', () => render());
  render();
}

init();

