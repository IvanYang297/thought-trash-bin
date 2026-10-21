import { attachTagPicker } from './tags.js';
// 冒险岛风格漂浮对话框：可输入、可拖动；拖进垃圾桶或三连击就保存
// 空对话框里的淡色提示语（只是 placeholder，永远不会被保存）
export const HINTS = ['想到啥写啥…', '吐个槽吧…', '心里话放这里…', '老板今天又说啥了？', '脑子里乱糟糟的，倒出来吧…', '一个突发奇想…', '今天最想吐槽的一件事…', '偷偷写，桶不会说出去的～'];
export const MAX_BUBBLES = 10;
const TRIPLE_MS = 600;
let hintIdx = Math.floor(Math.random() * HINTS.length);
let opts;
export function initBubbles(stage, o) {
  // o: { getTrashRect(), inTrash(rect,x,y), onHover(bool), onDrop(el,text,tag), onEmpty(), onLimit(), trashCenter() }
  opts = o;
  // 连击（detail>1）不算新建，避免三连击时点空了冒出新对话框
  stage.addEventListener('click', e => { if (e.target === stage && e.detail <= 1) createBubble(e.clientX - 80, e.clientY - 40); });
}
export const bubbleCount = () => document.querySelectorAll('#stage .bubble').length;
export function createBubble(x, y) {
  if (bubbleCount() >= MAX_BUBBLES) { opts?.onLimit?.(); return null; }
  const stage = document.getElementById('stage');
  if (x == null) { x = 40 + Math.random() * (innerWidth - 340); y = 80 + Math.random() * Math.max(60, innerHeight * 0.45); }
  x = Math.max(8, Math.min(x, innerWidth - 270)); y = Math.max(60, Math.min(y, innerHeight - 340));
  const b = document.createElement('div');
  b.className = 'bubble';
  b.style.left = x + 'px'; b.style.top = y + 'px';
  b.style.animationDelay = (-Math.random() * 3).toFixed(2) + 's';
  b.innerHTML = `<div class="grip"><span>⠿ 拖我进垃圾桶</span><span class="close" title="不要了">✕</span></div>
    <textarea placeholder="${HINTS[hintIdx++ % HINTS.length]}"></textarea>`;
  attachTagPicker(b);
  stage.appendChild(b);
  b.querySelector('.close').addEventListener('click', e => { e.stopPropagation(); b.remove(); });
  b.addEventListener('pointerdown', e => startDrag(e, b));
  // 三连击（600ms 内 3 次，边框或文字上都算）=> 自动飞进桶
  let clicks = [];
  b.addEventListener('click', e => {
    if (e.target.closest('.close, .tag-picker')) return;
    const now = performance.now(); clicks = clicks.filter(t => now - t < TRIPLE_MS); clicks.push(now);
    if (clicks.length >= 3) { clicks = []; flyToTrash(b); }
  });
  b.querySelector('textarea').focus();
  return b;
}
const textOf = b => b.querySelector('textarea').value.trim(); // 只取用户输入，提示语不在 value 里
function flyToTrash(b) {
  if (b.classList.contains('flying')) return;
  const text = textOf(b);
  if (!text) { b.classList.remove('bounce-here'); void b.offsetWidth; b.classList.add('bounce-here'); opts.onEmpty?.(); return; }
  window.getSelection()?.removeAllRanges(); b.querySelector('textarea').blur();
  const r = b.getBoundingClientRect(), c = opts.trashCenter();
  const dx = c.x - (r.left + r.width / 2), dy = c.y - (r.top + r.height / 2);
  b.classList.add('flying');
  b.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(.15) rotate(25deg)`;
  b.style.opacity = '0.2';
  setTimeout(() => opts.onDrop(b, text, b.dataset.tag || ''), 550);
}
// 流畅拖拽：拖动时只改 transform（rAF 合帧），桶的位置只在按下时量一次
function startDrag(e, b) {
  if (e.button !== 0 || e.target.closest('textarea, .close, .tag-picker') || b.classList.contains('flying')) return;
  e.preventDefault();
  const trashRect = opts.getTrashRect();
  const sx = e.clientX, sy = e.clientY, startL = b.style.left, startT = b.style.top;
  let dx = 0, dy = 0, px = sx, py = sy, raf = 0, over = false;
  b.classList.add('dragging'); b.setPointerCapture?.(e.pointerId);
  const frame = () => {
    raf = 0;
    b.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    const o = opts.inTrash(trashRect, px, py);
    if (o !== over) { over = o; opts.onHover(o); }
  };
  const move = ev => { px = ev.clientX; py = ev.clientY; dx = px - sx; dy = py - sy; if (!raf) raf = requestAnimationFrame(frame); };
  const up = ev => {
    b.removeEventListener('pointermove', move); b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up);
    if (raf) cancelAnimationFrame(raf);
    // 把位移落到 left/top 上，清掉 transform
    b.style.left = parseFloat(startL) + dx + 'px'; b.style.top = parseFloat(startT) + dy + 'px'; b.style.transform = '';
    b.classList.remove('dragging'); if (over) opts.onHover(false);
    if (!opts.inTrash(trashRect, ev.clientX, ev.clientY)) return;
    const text = textOf(b);
    if (text) return opts.onDrop(b, text, b.dataset.tag || '');
    bounceBack(b, startL, startT); opts.onEmpty?.();
  };
  b.addEventListener('pointermove', move); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
}
// 空对话框被拖进桶：轻轻弹回原位
function bounceBack(b, left, top) {
  b.classList.add('bounce');
  b.style.left = left; b.style.top = top;
  setTimeout(() => b.classList.remove('bounce'), 600);
}
