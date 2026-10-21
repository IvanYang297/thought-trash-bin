// 垃圾桶表情：在笑脸(0)和不开心(1)之间平滑过渡（JS 插值 SVG 路径）
const SMILE = [78, 145, 100, 165, 122, 145], FROWN = [80, 156, 100 , 138, 120, 156];
const DURATION = 1000;              // 过渡时长（毫秒）
export const CHEW_MS = 950;         // 等咀嚼动画结束再变脸
let cur = 0, target = 0, raf, timer;
const ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const lerp = (a, b, t) => a + (b - a) * t;
function paint(t) {
  const m = SMILE.map((v, i) => lerp(v, FROWN[i], t).toFixed(1));
  const $ = id => document.getElementById(id);
  $('trash-mouth').setAttribute('d', `M${m[0]} ${m[1]} Q${m[2]} ${m[3]} ${m[4]} ${m[5]}`);
  // 眉毛：淡入并从水平转成倒八字
  $('brow-l').setAttribute('d', `M66 ${lerp(94, 90, t)} L90 ${lerp(94, 101, t)}`);
  $('brow-r').setAttribute('d', `M134 ${lerp(94, 90, t)} L110 ${lerp(94, 101, t)}`);
  $('brow-l').setAttribute('opacity', t); $('brow-r').setAttribute('opacity', t);
  // 眼睛眯起来
  for (const e of ['eye-l', 'eye-r']) { $(e).setAttribute('ry', lerp(9, 5.5, t).toFixed(2)); $(e).setAttribute('cy', lerp(110, 112, t).toFixed(1)); }
  const tr = document.getElementById('trash'); tr.dataset.mood = t.toFixed(3);
}
function animateTo(to) {
  cancelAnimationFrame(raf);
  const from = cur, t0 = performance.now(), dur = DURATION * Math.abs(to - from);
  if (!dur) return paint(cur);
  const step = now => {
    const k = Math.min(1, (now - t0) / dur); cur = lerp(from, to, ease(k)); paint(cur);
    if (k < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
// unhappy=true 变不开心；delay 用于等咀嚼结束
export function setMood(unhappy, { delay = 0, instant = false } = {}) {
  target = unhappy ? 1 : 0; clearTimeout(timer);
  if (instant) { cancelAnimationFrame(raf); cur = target; paint(cur); return; }
  timer = setTimeout(() => animateTo(target), delay);
}
