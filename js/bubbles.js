// 冒险岛风格漂浮对话框：可输入、可拖动，拖进垃圾桶就保存
const PROMPTS = ['今天想吐槽点啥？', '脑子里乱糟糟的，写下来吧…', '心里话放这儿', '一个突发奇想…'];
let opts;
export function initBubbles(stage, o) {
  opts = o; // { isOverTrash(x,y), onHover(bool), onDrop(bubbleEl, text) }
  stage.addEventListener('click', e => { if (e.target === stage) createBubble(e.clientX - 80, e.clientY - 40); });
}
export function createBubble(x, y) {
  const stage = document.getElementById('stage');
  if (x == null) { x = 40 + Math.random() * (innerWidth - 340); y = 80 + Math.random() * Math.max(60, innerHeight * 0.45); }
  x = Math.max(8, Math.min(x, innerWidth - 270)); y = Math.max(60, Math.min(y, innerHeight - 340));
  const b = document.createElement('div');
  b.className = 'bubble';
  b.style.left = x + 'px'; b.style.top = y + 'px';
  b.style.animationDelay = (-Math.random() * 3).toFixed(2) + 's';
  b.innerHTML = `<div class="grip"><span>⠿ 拖我进垃圾桶</span><span class="close" title="不要了">✕</span></div>
    <textarea placeholder="${PROMPTS[Math.floor(Math.random() * PROMPTS.length)]}"></textarea>`;
  stage.appendChild(b);
  b.querySelector('.close').addEventListener('click', e => { e.stopPropagation(); b.remove(); });
  b.addEventListener('pointerdown', e => startDrag(e, b));
  b.querySelector('textarea').focus();
  return b;
}
function startDrag(e, b) {
  if (e.target.tagName === 'TEXTAREA' || e.target.classList.contains('close')) return;
  e.preventDefault();
  const r = b.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
  b.classList.add('dragging'); b.setPointerCapture?.(e.pointerId);
  const move = ev => {
    b.style.left = ev.clientX - dx + 'px'; b.style.top = ev.clientY - dy + 'px';
    opts.onHover(opts.isOverTrash(ev.clientX, ev.clientY));
  };
  const up = ev => {
    b.removeEventListener('pointermove', move); b.removeEventListener('pointerup', up);
    b.classList.remove('dragging'); opts.onHover(false);
    if (opts.isOverTrash(ev.clientX, ev.clientY)) opts.onDrop(b, b.querySelector('textarea').value.trim());
  };
  b.addEventListener('pointermove', move); b.addEventListener('pointerup', up);
}
