// 心情标签：每个对话框可选一个，随想法一起保存
export const TAGS = {
  rant: { emoji: '😤', name: '吐槽', color: '#ffd6d1' },
  idea: { emoji: '💡', name: '灵感', color: '#fff2b3' },
  heart: { emoji: '😢', name: '心里话', color: '#d6e8ff' },
};
export const tagLabel = t => TAGS[t] ? `${TAGS[t].emoji} ${TAGS[t].name}` : '无标签';
export const tagColor = t => TAGS[t]?.color || '#fffdf3';
// 在对话框里放一个小标签选择器，选中的标签记在 bubble.dataset.tag
export function attachTagPicker(bubble) {
  const box = document.createElement('div');
  box.className = 'tag-picker';
  box.innerHTML = Object.entries(TAGS).map(([k, t]) => `<button type="button" data-tag="${k}" title="${t.name}">${t.emoji}</button>`).join('');
  box.addEventListener('pointerdown', e => e.stopPropagation());
  box.addEventListener('click', e => {
    const k = e.target.closest('button')?.dataset.tag; if (!k) return;
    e.stopPropagation();
    bubble.dataset.tag = bubble.dataset.tag === k ? '' : k; // 再点一次取消
    box.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tag === bubble.dataset.tag));
    bubble.style.background = bubble.dataset.tag ? tagColor(bubble.dataset.tag) : '';
  });
  bubble.appendChild(box);
}
