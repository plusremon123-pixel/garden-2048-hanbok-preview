// Add the approved spring idle loop without replacing the existing published game bundle.
const animation = new URL('./spring-walk-collar-v3.webp', import.meta.url).href;
const poster = new URL('./spring-walk-collar-v3-poster.webp', import.meta.url).href;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const css = document.createElement('style');
css.textContent = '.hanbok-guide-character.spring-walk-v3{left:19.134047% !important;width:61.731906% !important;pointer-events:none}';
document.head.append(css);
let failed = false;
function sync() {
  document.querySelectorAll('img.hanbok-preview-character').forEach(image => {
    const original = /\/01-girl\.webp(?:\?|$)/.test(image.src);
    const ours = image.src === animation || image.src === poster;
    if (!original && !ours) {
      image.classList.remove('spring-walk-v3');
      if (image.dataset.springWalk === 'v3') { delete image.dataset.springWalk; delete image.dataset.motionNumber; }
      return;
    }
    if (failed) return;
    image.classList.add('spring-walk-v3');
    image.dataset.springWalk = 'v3';
    image.dataset.motionNumber = '1';
    const wanted = reduced.matches ? poster : animation;
    if (image.src !== wanted) {
      const fallback = new URL('./01-girl.webp', import.meta.url).href;
      image.addEventListener('error', () => { failed = true; image.classList.remove('spring-walk-v3'); delete image.dataset.springWalk; delete image.dataset.motionNumber; image.src = fallback; }, { once: true });
      image.src = wanted;
    }
  });
}
const observer = new MutationObserver(sync);
observer.observe(document.getElementById('root'), { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
reduced.addEventListener('change', sync);
sync();
