// Only the eleven confirmed outdoor girl outfits. The published bundle remains intact.
const numbers = new Set([2, 4, 7, 9, 12, 13, 14, 16, 17, 21, 22]);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const failed = new Set();
const watched = new WeakSet();
const url = (filename) => new URL(`./${filename}`, import.meta.url).href;
const filename = (number) => `outdoor-${String(number).padStart(2, '0')}-girl-walk-v${[12,21].includes(number) ? 3 : 2}`;
function identify(image) {
  const path = new URL(image.src, location.href).pathname;
  const match = path.match(/\/(\d{2})-girl\.webp$/) || path.match(/\/outdoor-(\d{2})-girl-walk-v[23](?:-poster)?\.webp$/);
  const number = match ? Number(match[1]) : null;
  return numbers.has(number) ? number : null;
}
function clear(image) {
  if (!image.dataset.outdoorGirlWalk) return;
  delete image.dataset.outdoorGirlWalk;
  if (!image.dataset.springWalk && !image.dataset.apricotWalk) delete image.dataset.motionNumber;
}
function sync() {
  document.querySelectorAll('img.hanbok-preview-character').forEach(image => {
    const number = identify(image);
    if (number === null) { clear(image); return; }
    if (failed.has(number)) { clear(image); return; }
    if (!watched.has(image)) {
      watched.add(image);
      image.addEventListener('error', event => {
        const current = identify(image);
        if (current === null || !/\/outdoor-/.test(new URL(image.src).pathname)) return;
        // The published spring module may have an old listener on a reused image.
        event.stopImmediatePropagation();
        failed.add(current);
        clear(image);
        image.src = url(`${String(current).padStart(2, '0')}-girl.webp`);
      }, { capture: true });
    }
    image.dataset.outdoorGirlWalk = String(number);
    image.dataset.motionNumber = '1';
    const wanted = url(`${filename(number)}${reduced.matches ? '-poster' : ''}.webp`);
    if (image.src !== wanted) image.src = wanted;
  });
}
const root = document.getElementById('root');
if (root) {
  new MutationObserver(sync).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  reduced.addEventListener('change', sync);
  sync();
}
