// 心情标签：每个对话框可选一个，随想法一起保存
export const TAGS = {
  rant: { emoji: '😤', name: '吐槽', color: '#ffd6d1' },
  idea: { emoji: '💡', name: '灵感', color: '#fff2b3' },
  heart: { emoji: '😢', name: '心里话', color: '#d6e8ff' },
};
export const tagLabel = t => TAGS[t] ? `${TAGS[t].emoji} ${TAGS[t].name}` : '无标签';
export const tagColor = t => TAGS[t]?.color || '#fffdf3';
// 标签提示气泡：全局一个，挂在 body 上用 fixed 定位，不会被对话框边缘裁掉
let tip, tipTimer;
function showTip(btn, text, ms = 0) {
  if (!tip) { tip = document.createElement('div'); tip.id = 'tag-tip'; tip.setAttribute('role', 'status'); document.body.appendChild(tip); }
  clearTimeout(tipTimer);
  tip.textContent = text;
  const r = btn.getBoundingClientRect();
  tip.classList.add('show');
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let x = r.left + r.width / 2 - w / 2, y = r.top - h - 8, below = false;
  if (y < 4) { y = r.bottom + 8; below = true; }
  x = Math.max(4, Math.min(x, innerWidth - w - 4));
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
  tip.classList.toggle('below', below);
  tip.style.setProperty('--ax', r.left + r.width / 2 - x + 'px');
  if (ms) tipTimer = setTimeout(hideTip, ms);
}
function hideTip() { clearTimeout(tipTimer); tip?.classList.remove('show'); }
const TAP_MS = 1500;
// 在对话框里放一个小标签选择器，选中的标签记在 bubble.dataset.tag
export function attachTagPicker(bubble) {
  const box = document.createElement('div');
  box.className = 'tag-picker';
  box.innerHTML = Object.entries(TAGS).map(([k, t]) => `<button type="button" data-tag="${k}" aria-label="${t.name}"><span class="tg" aria-hidden="true">${t.emoji}</span></button>`).join('');
  box.addEventListener('pointerdown', e => e.stopPropagation());
  // 鼠标悬停显示名称；触屏没有悬停，点一下时显示约 1.5 秒
  box.addEventListener('pointerover', e => { const b = e.target.closest('button'); if (b && e.pointerType === 'mouse') showTip(b, TAGS[b.dataset.tag].name); });
  box.addEventListener('pointerout', e => { const b = e.target.closest('button'); if (b && e.pointerType === 'mouse' && !b.contains(e.relatedTarget)) hideTip(); });
  box.addEventListener('click', e => {
    const btn = e.target.closest('button'), k = btn?.dataset.tag; if (!k) return;
    e.stopPropagation();
    bubble.dataset.tag = bubble.dataset.tag === k ? '' : k; // 再点一次取消
    box.querySelectorAll('button').forEach(b => { b.classList.toggle('on', b.dataset.tag === bubble.dataset.tag); b.setAttribute('aria-pressed', b.dataset.tag === bubble.dataset.tag); });
    bubble.style.background = bubble.dataset.tag ? tagColor(bubble.dataset.tag) : '';
    showTip(btn, bubble.dataset.tag ? `已选：${TAGS[k].name}` : '已取消', TAP_MS);
  });
  bubble.appendChild(box);
}
