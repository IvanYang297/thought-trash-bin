// 越吃越满：桶里的纸团随「未整理」想法数增多；满了会打嗝，提醒去 AI 整理
export const FULL_AT = 20;   // 满桶阈值（未整理的条数）
const LEVELS = 5;            // 纸堆层数
// 每层几个纸团：[x, y, r]，从桶底往上堆
const LAYERS = [
  [[60, 205, 13], [88, 207, 14], [116, 206, 13], [142, 204, 12]],
  [[66, 186, 13], [96, 188, 14], [126, 186, 13]],
  [[56, 168, 12], [84, 170, 13], [112, 168, 13], [140, 170, 12]],
  [[62, 150, 12], [92, 148, 13], [122, 150, 13], [148, 152, 10]],
  [[52, 132, 11], [78, 128, 12], [104, 126, 13], [130, 129, 12], [154, 134, 10]],
];
export const levelFor = n => Math.min(LEVELS, Math.ceil((Math.min(n, FULL_AT) / FULL_AT) * LEVELS));
export function renderPile(unsorted) {
  const g = document.getElementById('trash-pile'), lv = levelFor(unsorted);
  g.innerHTML = LAYERS.slice(0, lv).flat().map(([x, y, r], i) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 ? '#fffdf3' : '#f3e7c9'}" stroke="#b49a6a" stroke-width="2"/>`).join('');
  document.getElementById('trash').dataset.level = lv;
  document.getElementById('trash').classList.toggle('full', unsorted >= FULL_AT);
  return lv;
}
// 存完一条后调用：刚满 / 满后每多 5 条，打一次嗝
export function shouldBurp(unsorted) { return unsorted >= FULL_AT && (unsorted - FULL_AT) % 5 === 0; }
export function burp(toast) {
  const t = document.getElementById('trash');
  t.classList.remove('burp'); void t.offsetWidth; t.classList.add('burp');
  const s = document.createElement('div'); s.className = 'burp-bubble'; s.textContent = '嗝～';
  document.getElementById('trash-wrap').appendChild(s); setTimeout(() => s.remove(), 1600);
  setTimeout(() => t.classList.remove('burp'), 1200);
  toast(`嗝～桶里有 ${FULL_AT} 条以上没整理的想法了，去「AI整理」理一理吧！`, 4000);
}
