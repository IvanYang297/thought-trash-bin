// 垃圾桶表情：笑脸(0) ⇄ 苦脸(1) 平滑过渡。用 JS 插值直接写内联样式，
// 所以不依赖 !important 去覆盖美术文件里的内联 opacity，两个方向都一样顺。
const DURATION = 1000;      // 过渡时长（毫秒）
export const CHEW_MS = 950; // 等咀嚼动画结束再变脸
const SMILE = [106, 176, 120, 192, 134, 176], FROWN = [106, 188, 120, 174, 134, 188];
let cur = 0, target = 0, raf, timer;
const ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const $ = id => document.getElementById(id);
function paint(t) {
  const m = SMILE.map((v, i) => lerp(v, FROWN[i], t).toFixed(1));
  $('mouth-smile').setAttribute('d', `M${m[0]} ${m[1]} Q${m[2]} ${m[3]} ${m[4]} ${m[5]}`); // 嘴角慢慢往下弯
  $('mouth-frown').style.opacity = 0;  // 用变形的嘴代替淡入淡出
  $('brows').style.opacity = t;
  $('brows').style.transform = `translateY(${lerp(-4, 0, t)}px)`;
  $('sweat').style.opacity = t;
  for (const c of ['cheek-l', 'cheek-r']) $(c).style.opacity = lerp(.7, .35, t);
  for (const e of ['eye-l', 'eye-r']) $(e).style.transform = `scaleY(${lerp(1, .6, t)})`; // 眯眼
  $('trash').dataset.mood = t.toFixed(3);
  $('trash').classList.toggle('is-sad', t > .5);
}
function animateTo(to) {
  cancelAnimationFrame(raf);
  const from = cur, t0 = performance.now(), dur = DURATION * Math.abs(to - from);
  if (!dur) return paint(cur);
  const step = now => { const k = Math.min(1, (now - t0) / dur); cur = lerp(from, to, ease(k)); paint(cur); if (k < 1) raf = requestAnimationFrame(step); };
  raf = requestAnimationFrame(step);
}
export function setMood(unhappy, { delay = 0, instant = false } = {}) {
  target = unhappy ? 1 : 0; clearTimeout(timer);
  if (instant) { cancelAnimationFrame(raf); cur = target; paint(cur); return; }
  timer = setTimeout(() => animateTo(target), delay);
}
