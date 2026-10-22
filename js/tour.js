import { t, toggleLang } from './i18n.js';
// 首次访问：落地页（真实 HTML，在 index.html 里）+ 分步引导。看过一次就记在 localStorage，之后自动跳过；可从「使用须知」重新打开
const LANDED = 'ttb.landed', TOURED = 'ttb.toured';
const STEPS = [
  ['.bubble', 'tour.1'], ['.bubble .tag-picker', 'tour.2'], ['#trash', 'tour.3'], ['#trash', 'tour.4'],
  ['#btn-list, #btn-review', 'tour.5'], ['#btn-ai', 'tour.6'], ['#btn-help', 'tour.7'],
];
let tip, marks = [];
function clear() { marks.forEach(m => m.classList.remove('tour-mark')); marks = []; }
export function endTour() { clear(); tip?.remove(); tip = null; localStorage.setItem(TOURED, '1'); }
export function startTour(i = 0) {
  clear(); tip?.remove();
  const [sel, text] = STEPS[i], els = [...document.querySelectorAll(sel)].slice(0, sel === '.bubble' || sel.includes('tag') ? 1 : 2);
  if (!els.length) return i + 1 < STEPS.length ? startTour(i + 1) : endTour();
  els.forEach(e => e.classList.add('tour-mark')); marks = els;
  tip = document.createElement('div'); tip.id = 'tour-tip'; tip.setAttribute('role', 'dialog');
  const last = i === STEPS.length - 1;
  tip.innerHTML = `<p>${t(text)}</p><div class="row"><span class="step">${i + 1}/${STEPS.length}</span>${last ? '' : `<button class="skip">${t('tour.skip')}</button>`}<button class="next">${last ? t('tour.done') : t('tour.next')}</button></div>`;
  document.body.appendChild(tip);
  const r = els.map(e => e.getBoundingClientRect()).reduce((a, b) => ({ left: Math.min(a.left, b.left), right: Math.max(a.right, b.right), top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom) }));
  const W = tip.offsetWidth, H = tip.offsetHeight;
  const below = r.bottom + 10 + H < innerHeight - 8;
  tip.style.top = (below ? r.bottom + 10 : Math.max(8, r.top - H - 10)) + 'px';
  tip.style.left = Math.min(innerWidth - W - 8, Math.max(8, (r.left + r.right) / 2 - W / 2)) + 'px';
  tip.classList.toggle('above', !below);
  tip.querySelector('.next').onclick = () => last ? endTour() : startTour(i + 1);
  tip.querySelector('.skip')?.addEventListener('click', endTour);
}
// 落地页：回访用户自动跳过
export function initLanding() {
  const land = document.getElementById('landing');
  const enter = () => { land.hidden = true; localStorage.setItem(LANDED, '1'); if (!localStorage.getItem(TOURED)) setTimeout(() => startTour(0), 300); };
  if (localStorage.getItem(LANDED)) { land.hidden = true; if (!localStorage.getItem(TOURED)) setTimeout(() => startTour(0), 300); return; }
  land.hidden = false;
  land.querySelector('#land-lang').onclick = toggleLang;
  land.querySelector('#land-enter').onclick = enter;
  land.querySelector('#land-skip').onclick = e => { e.preventDefault(); enter(); };
}
const redo = () => { if (tip) { const s = tip.querySelector('.step').textContent; startTour(+s.split('/')[0] - 1); } };
addEventListener('resize', redo); addEventListener('ttb-lang', redo);
