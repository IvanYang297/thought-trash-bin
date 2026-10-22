// 顶部滚动横幅：默认文案在 js/i18n.js 的 banner.lines（中英各一组）
import { t } from './i18n.js';
export const defaultLines = () => t('banner.lines');
import { getCustom } from './custom-banner.js';
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 默认文案与自定义文案交错混排
export function allLines() {
  const out = [...defaultLines()], cu = getCustom();
  cu.forEach((l, i) => out.splice(Math.min(out.length, (i + 1) * 3 + i), 0, l));
  return out;
}
export function initBanner(el = document.getElementById('banner')) {
  const track = el.querySelector('#banner-track'), cu = getCustom();
  const html = allLines().map(t => `<span class="${cu.includes(t) ? 'mine' : ''}">${cu.includes(t) ? '✍️' : '💢'} ${esc(t)}</span>`).join('');
  track.innerHTML = html + html; // 复制一份，实现无缝循环
}
