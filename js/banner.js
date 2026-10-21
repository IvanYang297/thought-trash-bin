// 顶部滚动横幅：想改文案，直接改这个数组就行
export const BANNER_LINES = [
  '今天也是想辞职的一天', '老板又画饼了，我已经吃饱了', '周一综合征晚期，医生说没救了',
  '会议开了两小时，结论是再开一次会', '工资像大姨妈，一个月一次，一周就没了',
  '“这个需求很简单”——史上最可怕的七个字', '我不是在摸鱼，我是在思考人生',
  '打工人，打工魂，打工都是人上人（并不是）', '离下班还有 8 小时，离退休还有 30 年',
  '“辛苦了”不如“涨工资了”', '收到，好的，没问题，马上改——第 18 版', '我的工位就是我的牢房',
  '早上的我：今天要努力；下午的我：算了', '周报写得比我干的活还精彩', '领导说“随便聊聊”，我开始写遗书',
  '加班不可怕，可怕的是没有加班费', '我和闹钟之间，必须有一个先离职', '“你先做着，后面再说”，后面就没有后面了',
  '咖啡续命，奶茶回血，下班复活', '把烦恼丢进垃圾桶，明天又是一条好汉',
];
import { getCustom } from './custom-banner.js';
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 默认文案与自定义文案交错混排
export function allLines() {
  const out = [...BANNER_LINES], cu = getCustom();
  cu.forEach((l, i) => out.splice(Math.min(out.length, (i + 1) * 3 + i), 0, l));
  return out;
}
export function initBanner(el = document.getElementById('banner')) {
  const track = el.querySelector('#banner-track'), cu = getCustom();
  const html = allLines().map(t => `<span class="${cu.includes(t) ? 'mine' : ''}">${cu.includes(t) ? '✍️' : '💢'} ${esc(t)}</span>`).join('');
  track.innerHTML = html + html; // 复制一份，实现无缝循环
}
