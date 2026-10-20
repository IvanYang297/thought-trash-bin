// 垃圾桶：判断是否拖入、咀嚼动画、计数、双击/狂点触发彩蛋
let el, countEl, n = 0;
export function initTrash(o) {
  el = document.getElementById('trash'); countEl = document.getElementById('count');
  let clicks = [], lastBurst = 0;
  const burst = () => { if (Date.now() - lastBurst > 800) { lastBurst = Date.now(); o.onBurst(); } };
  el.addEventListener('dblclick', burst);
  el.addEventListener('click', () => {
    const now = Date.now(); clicks = clicks.filter(t => now - t < 2000); clicks.push(now);
    if (clicks.length >= 5) { clicks = []; burst(); }
  });
}
export function isOverTrash(x, y) {
  const r = el.getBoundingClientRect(), m = 30;
  return x > r.left - m && x < r.right + m && y > r.top - m && y < r.bottom + m;
}
export const setHover = on => el.classList.toggle('hover', on);
export function chew() { el.classList.remove('chew'); void el.offsetWidth; el.classList.add('chew'); setTimeout(() => el.classList.remove('chew'), 1000); }
export function setCount(v) { n = v; countEl.textContent = n; }
export const increment = () => setCount(n + 1);
export const trashCenter = () => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.3 }; };
