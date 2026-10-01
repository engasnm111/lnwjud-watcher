(() => {
  if (!navigator.serviceWorker?.controller) return;

  const style = document.createElement('style');
  style.id = 'watcher-native-update-migration';
  style.textContent = '.update-overlay { display: none !important; }';

  if (document.documentElement) {
    document.documentElement.appendChild(style);
    return;
  }

  const observer = new MutationObserver(() => {
    if (!document.documentElement) return;
    observer.disconnect();
    document.documentElement.appendChild(style);
  });
  observer.observe(document, { childList: true });
})();
