import { t } from './i18n.js';
// 越吃越满：按「未经 AI 整理」的想法条数切换垃圾桶状态（美术见 assets/can/）
//   0：笑脸   ≥1：苦脸   ≥20：盖子合不上、纸团从盖沿挤出 + 打嗝   ≥100：纸团狂喷、盖子拉锯
// 纸团只出现在盖子/桶口附近（y < 110），脸在 y 128 以下，不会被挡住。
import { setMood, CHEW_MS } from './face.js';
export const FULL_AT = 20;
export const BURST_AT = 100;
export const stateFor = n => n >= BURST_AT ? 'struggle' : n >= FULL_AT ? 'ajar' : n > 0 ? 'unhappy' : 'happy';
let first = true;
export function renderPile(unsorted, { afterChew = false } = {}) {
  const t = document.getElementById('trash'), st = stateFor(unsorted);
  setMood(st !== 'happy', { delay: afterChew ? CHEW_MS : 0, instant: first }); first = false;
  t.dataset.state = st; t.dataset.unsorted = unsorted;
  return st;
}
export function shouldBurp(unsorted) { return unsorted >= FULL_AT && (unsorted - FULL_AT) % 5 === 0; }
export function burp(toast) {
  const tb = document.getElementById('trash');
  tb.classList.remove('burp'); void tb.offsetWidth; tb.classList.add('burp');
  const s = document.createElement('div'); s.className = 'burp-bubble'; s.textContent = t('burp.bubble');
  document.getElementById('trash-wrap').appendChild(s); setTimeout(() => s.remove(), 1600);
  setTimeout(() => tb.classList.remove('burp'), 1200);
  toast(t('burp.toast', { n: FULL_AT }), 4000);
}
