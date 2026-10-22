// 本周回顾卡片：统计本周各标签数量，画在 canvas 上，可下载 PNG；每周五自动弹一次
import { TAGS } from './tags.js';
const SEEN = 'ttb.reviewSeenWeek';
export const SITE = 'https://thought-trash-bin.pages.dev/';
export function weekStart(d = new Date()) { const s = new Date(d); s.setHours(0, 0, 0, 0); s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); return s; }
const key = d => { const s = weekStart(d); return `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`; };
export function weekStats(notes, now = new Date()) {
  const from = weekStart(now).getTime();
  const wk = notes.filter(n => n.createdAt >= from);
  const by = { rant: 0, idea: 0, heart: 0, none: 0 };
  wk.forEach(n => by[TAGS[n.tag] ? n.tag : 'none']++);
  return { total: wk.length, by, from: weekStart(now), to: now };
}
const COMMENTS = [[0, '这周很安静，是不是太忙了？'], [1, '这周丢了几条，状态还行～'], [10, '这周脑子很活跃嘛！'], [25, '这周槽点满满，辛苦了，抱抱！']];
export const FOOTER_URL = 'thought-trash-bin.pages.dev';
export function drawCard(canvas, st) {
  const W = 600, H = 760; canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d'), F = '"PingFang SC","Microsoft YaHei",sans-serif';
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#bfe6ff'); g.addColorStop(1, '#fff7e0');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  const rr = (x, y, w, h, r, fill, stroke) => { c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = fill; c.fill(); if (stroke) { c.lineWidth = 5; c.strokeStyle = stroke; c.stroke(); } };
  rr(30, 30, W - 60, H - 60, 28, '#fffdf3', '#3b2a14');
  c.fillStyle = '#3b2a14'; c.textAlign = 'center';
  c.font = `bold 40px ${F}`; c.fillText('🗑️ 本周思绪回顾', W / 2, 105);
  const f = d => `${d.getMonth() + 1}月${d.getDate()}日`;
  c.font = `20px ${F}`; c.fillStyle = '#9a7b4f'; c.fillText(`${f(st.from)} – ${f(st.to)}`, W / 2, 145);
  c.fillStyle = '#c0392b'; c.font = `bold 110px ${F}`; c.fillText(String(st.total), W / 2, 275);
  c.fillStyle = '#3b2a14'; c.font = `24px ${F}`; c.fillText('本周一共丢进垃圾桶的想法（条）', W / 2, 315);
  const rows = [...Object.entries(TAGS).map(([k, t]) => [t.emoji + ' ' + t.name, st.by[k], t.color]), ['🏷️ 无标签', st.by.none, '#eeeeee']];
  const max = Math.max(1, ...rows.map(r => r[1]));
  rows.forEach(([label, n, col], i) => {
    const y = 360 + i * 70;
    c.textAlign = 'left'; c.font = `bold 24px ${F}`; c.fillStyle = '#3b2a14'; c.fillText(label, 70, y + 30);
    rr(210, y + 6, 280, 32, 16, '#f1ead8');
    if (n) rr(210, y + 6, Math.max(32, 280 * n / max), 32, 16, col, '#3b2a14');
    c.textAlign = 'right'; c.fillStyle = '#3b2a14'; c.fillText(String(n), 535, y + 30);
  });
  const cm = COMMENTS.filter(([m]) => st.total >= m).pop()[1];
  c.textAlign = 'center'; c.font = `bold 24px ${F}`; c.fillStyle = '#5a3e1b'; c.fillText(cm, W / 2, 665);
  c.font = `16px ${F}`; c.fillStyle = '#9a7b4f'; c.fillText('—— 思绪垃圾桶', W / 2, 700);
  c.font = `14px ${F}`; c.fillStyle = '#b39a74'; c.fillText(FOOTER_URL, W / 2, 722);
  canvas.dataset.footer = FOOTER_URL;
}
export function showReview(notes, now = new Date()) {
  document.getElementById('review')?.remove();
  const st = weekStats(notes, now);
  const ov = document.createElement('div'); ov.id = 'review';
  ov.innerHTML = `<div class="review-box"><canvas></canvas><div class="row"><button id="review-share">📤 分享</button><button id="review-dl">⬇ 下载 PNG</button><button id="review-close">关闭</button></div></div>`;
  document.body.appendChild(ov);
  const cv = ov.querySelector('canvas'); drawCard(cv, st);
  ov.querySelector('#review-close').onclick = () => ov.remove();
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  ov.querySelector('#review-dl').onclick = () => { const a = document.createElement('a'); a.href = cv.toDataURL('image/png'); a.download = `本周回顾-${key(now)}.png`; a.click(); };
  // 分享：支持系统分享（手机等）就带图片分享；否则下载图片 + 复制网址
  ov.querySelector('#review-share').onclick = () => cv.toBlob(async blob => {
    const name = `本周回顾-${key(now)}.png`, file = new File([blob], name, { type: 'image/png' });
    const data = { files: [file], title: '本周思绪回顾', text: `这周我往思绪垃圾桶里丢了 ${st.total} 条想法 ${SITE}` };
    if (navigator.canShare?.(data)) { try { await navigator.share(data); } catch {} return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    let ok = false; try { await navigator.clipboard.writeText(SITE); ok = true; } catch {}
    window.dispatchEvent(new CustomEvent('ttb-toast', { detail: ok ? '图片已下载，网址已复制，发给朋友吧～' : '图片已下载，网址：' + SITE }));
  }, 'image/png');
  localStorage.setItem(SEEN, key(now));
  return st;
}
// 周五自动弹出（每周一次）
export function maybeAutoShow(notes, now = new Date()) {
  if (now.getDay() === 5 && localStorage.getItem(SEEN) !== key(now)) { showReview(notes, now); return true; }
  return false;
}
