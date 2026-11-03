// Outfit 02 boy walking preview, isolated from the existing published game bundle.
const animation = new URL('./apricot-boy-walk-v1.webp', import.meta.url).href;
const poster = new URL('./apricot-boy-walk-v1-poster.webp', import.meta.url).href;
const fallback = new URL('./02-boy.webp', import.meta.url).href;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const watched = new WeakSet();
let failed = false;
function clear(image) {
  if (image.dataset.apricotWalk !== 'v1') return;
  delete image.dataset.apricotWalk;
  if (!image.dataset.springWalk) delete image.dataset.motionNumber;
}
function sync() {
  document.querySelectorAll('img.hanbok-preview-character').forEach(image => {
    const original = /\/02-boy\.webp(?:\?|$)/.test(image.src);
    const ours = image.src === animation || image.src === poster;
    if (!original && !ours) { clear(image); return; }
    if (failed) return;
    if (!watched.has(image)) {
      watched.add(image);
      image.addEventListener('error', () => {
        if (image.src !== animation && image.src !== poster) return;
        failed = true;
        clear(image);
        image.src = fallback;
      });
    }
    image.dataset.apricotWalk = 'v1';
    image.dataset.motionNumber = '1';
    const wanted = reduced.matches ? poster : animation;
    if (image.src !== wanted) image.src = wanted;
  });
}
const root = document.getElementById('root');
if (root) {
  new MutationObserver(sync).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  reduced.addEventListener('change', sync);
  sync();
}
