// 越吃越满：按「未经 AI 整理」的想法条数改变垃圾桶状态（不再在桶里画纸堆，脸永远露在外面）
//   0 条：笑脸        ≥1：不开心的脸
//   ≥20：盖子合不上、微微翘起，纸团从盖子边挤出来；刚满 20（及之后每 5 条）打嗝提醒
//   ≥100：纸团不停从桶口喷出，盖子拼命往下压、又被顶起来（拉锯抖动）
import { paperBall } from './paper.js';
import { setMood, CHEW_MS } from './face.js';
export const FULL_AT = 20;
export const BURST_AT = 100;
export const stateFor = n => n >= BURST_AT ? 'struggle' : n >= FULL_AT ? 'ajar' : n > 0 ? 'unhappy' : 'happy';
// 盖子边缘挤出的纸团 [x, y, r]（在盖子下、桶口上，不碰到脸）
const PEEK = [[146, 44, 20], [176, 34, 17], [118, 50, 14]];
const ball = (x, y, r, cls = '', style = '', seed = 1) => `<g class="${cls}" transform="translate(${x} ${y})"><g style="${style}">${paperBall(r, seed)}</g></g>`;
let lastState;
export function renderPile(unsorted, { afterChew = false } = {}) {
  const t = document.getElementById('trash'), st = stateFor(unsorted);
  setMood(st !== 'happy', { delay: afterChew ? CHEW_MS : 0, instant: lastState === undefined });
  t.dataset.state = st; t.dataset.unsorted = unsorted;
  if (st === lastState) return st;
  lastState = st;
  const peek = document.getElementById('trash-peek'), burst = document.getElementById('trash-burst');
  peek.innerHTML = st === 'ajar' || st === 'struggle' ? PEEK.map(([x, y, r], i) => ball(x, y, r, 'peek', `animation-delay:${-i * 0.37}s`, i + 3)).join('') : '';
  // 喷出的纸团：每个有自己的方向、距离和节奏，循环播放
  burst.innerHTML = st === 'struggle' ? Array.from({ length: 12 }, (_, i) => {
    const dx = (i % 2 ? 1 : -1) * (30 + (i * 37) % 90), dy = -(70 + (i * 53) % 80);
    return ball(100 + (i % 5 - 2) * 18, 44, 16 + (i % 3) * 5, 'fly', `--dx:${dx}px;--dy:${dy}px;animation-duration:${1.3 + (i % 4) * 0.25}s;animation-delay:${-i * 0.27}s`, i + 11);
  }).join('') : '';
  return st;
}
export function shouldBurp(unsorted) { return unsorted >= FULL_AT && (unsorted - FULL_AT) % 5 === 0; }
export function burp(toast) {
  const t = document.getElementById('trash');
  t.classList.remove('burp'); void t.offsetWidth; t.classList.add('burp');
  const s = document.createElement('div'); s.className = 'burp-bubble'; s.textContent = '嗝～';
  document.getElementById('trash-wrap').appendChild(s); setTimeout(() => s.remove(), 1600);
  setTimeout(() => t.classList.remove('burp'), 1200);
  toast(`嗝～桶里有 ${FULL_AT} 条以上没整理的想法了，去「AI整理」理一理吧！`, 4000);
}
