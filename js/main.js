import { buildMysticPrompt } from './mystic-prompt.js';
// 入口：把各模块串起来。新功能建议新建一个模块文件，再在这里接上。
import { initBanner } from './banner.js';
import { initBubbles, createBubble } from './bubbles.js';
import * as trash from './trashbin.js';
import * as store from './storage.js';
import * as ai from './ai.js';
import { renderList, selected } from './list.js';
import { explode } from './easter-eggs.js';
import * as fill from './fill.js';
import * as review from './review.js';
import { initShortcuts } from './shortcuts.js';
import * as cb from './custom-banner.js';
import { initHelpPopover } from './help.js';

const $ = s => document.querySelector(s);
export function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms); }

initBanner($('#banner'));
trash.initTrash({ onBurst: async () => explode(await store.listNotes(), trash.trashCenter()) });
initBubbles($('#stage'), {
  getTrashRect: trash.getTrashRect, inTrash: trash.inTrash, trashCenter: trash.trashCenter, onHover: trash.setHover,
  onLimit: () => toast('最多 10 个对话框，先丢几个进桶吧～'),
  onEmpty: () => toast('空的对话框，桶不吃哦～先写点什么吧'),
  onDrop: async (b, text, tag) => {
    b.remove(); trash.chew();
    try { const n = await store.saveNote(text, tag); trash.setCount(await store.countNotes()); toast(n.inFolder ? '嚼嚼嚼…已存进文件夹 📁' : '嚼嚼嚼…已存在浏览器里');
      const u = await store.countUnsorted(); fill.renderPile(u, { afterChew: true }); if (fill.shouldBurp(u)) setTimeout(() => fill.burp(toast), 1000); refreshPanel(); }
    catch (e) { console.error(e); toast('保存失败：' + e.message); }
  },
});
$('#btn-add').onclick = () => createBubble();
initShortcuts(() => createBubble());
function addBannerLine(t) { if (cb.addCustom(t)) { initBanner(); toast('已加到横幅 ✍️'); } else toast('这句已经在横幅里了（或为空）'); }

const panel = $('#panel'), body = $('#panel-body');
let current = null;
const PANEL_BTN = { list: '#btn-list', ai: '#btn-ai', settings: '#btn-settings' };
// 面板像「使用须知」一样：小卡片挂在自己的按钮下面，带小箭头；点击打开，再点按钮 / 点外面 / Esc 关闭
function placePanel() {
  const r = $(PANEL_BTN[current]).getBoundingClientRect(), W = panel.offsetWidth;
  const right = Math.max(8, innerWidth - r.right), top = r.bottom + 8;
  panel.style.top = top + 'px'; panel.style.right = right + 'px';
  const arrow = Math.min(W - 18, Math.max(12, (innerWidth - right) - (r.left + r.width / 2) - 6));
  panel.style.setProperty('--arrow-right', arrow + 'px');
  // 不挡住垃圾桶：横向和桶重叠时，卡片底部停在桶顶上方
  const t = trash.getTrashRect(), left = innerWidth - right - W;
  let maxH = Math.min(innerHeight * 0.7, 520);
  if (left < t.right && innerWidth - right > t.left) maxH = Math.min(maxH, t.top - top - 12);
  panel.style.maxHeight = Math.max(140, maxH) + 'px';
}
function closePanel() { panel.classList.add('hidden'); current = null; document.querySelectorAll('#toolbar .on').forEach(b => b.classList.remove('on')); }
function openPanel(kind) {
  if (current === kind) return closePanel();
  closePanel(); current = kind; panel.classList.remove('hidden'); $(PANEL_BTN[kind]).classList.add('on');
  placePanel(); refreshPanel();
}
addEventListener('resize', () => current && placePanel());
document.addEventListener('pointerdown', e => {
  if (!current || panel.contains(e.target) || e.target.closest(Object.values(PANEL_BTN).join(','))) return;
  closePanel();
}, true);
$('#panel-close').onclick = closePanel;
$('#btn-list').onclick = () => openPanel('list');
$('#btn-review').onclick = async () => review.showReview(await store.listNotes());
$('#btn-ai').onclick = () => openPanel('ai');
$('#btn-settings').onclick = () => openPanel('settings');
initHelpPopover($('#btn-help'));
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('review')) return document.getElementById('review').remove();
  if (current) closePanel();
});
async function refreshPanel() {
  if (!current) return;
  body.classList.remove('fixed-controls');
  $('#panel-title').textContent = { list: '想法列表', ai: 'AI 整理', settings: '设置' }[current];
  if (current === 'list') return renderList(body, async () => { trash.setCount(await store.countNotes()); fill.renderPile(await store.countUnsorted()); }, addBannerLine);
  if (current === 'ai') return renderAI();
  renderSettings();
}
async function pickedNotes() {
  const all = await store.listNotes();
  return selected.size ? all.filter(n => selected.has(n.id)) : all;
}
async function renderAI() {
  const notes = await pickedNotes();
  body.innerHTML = `<p>将整理 <b>${notes.length}</b> 条想法（${selected.size ? '已勾选的' : '全部；可在「想法列表」里勾选'}）。</p>
    <div class="row"><button id="go">✨ 用 DeepSeek 整理</button><button id="copy">📋 一键复制整理提示词</button><button id="mystic">🔮 复制玄学解读提示词</button></div>
    <p style="font-size:12px;color:#888">没有密钥？复制提示词后贴到豆包或 WorkBuddy 里用。</p><div id="out"></div>`;
  body.querySelector('#copy').onclick = async () => { await ai.copyPrompt(notes); toast('提示词已复制，去粘贴吧～'); };
  body.querySelector('#mystic').onclick = async () => { await ai.copyText(buildMysticPrompt(notes)); toast('提示词已复制，去粘贴吧～'); };
  body.querySelector('#go').onclick = async () => {
    if (!notes.length) return toast('还没有想法可以整理');
    const out = body.querySelector('#out'); out.textContent = '思考中…';
    try {
      const md = await ai.organize(notes);
      await store.markOrganized(notes.map(n => n.id)); fill.renderPile(await store.countUnsorted());
      const f = await store.saveResult(`# AI 整理结果（${store.fmtFull(Date.now())}）\n\n${md}\n`);
      out.innerHTML = ''; const pre = document.createElement('pre'); pre.className = 'result'; pre.textContent = md; out.appendChild(pre);
      toast(f.inFolder ? `已保存到文件夹：${f.name}` : `已下载：${f.name}`);
    } catch (e) { out.textContent = e.message; }
  };
}
function renderSettings() {
  const sf = store.supportsFolder();
  body.innerHTML = `<h3>📁 保存位置</h3>
    <p>${sf ? (store.folderName() ? `当前文件夹：<b>${store.folderName()}</b>` : store.needsReauth() ? '需要重新授权上次的文件夹' : '还没选文件夹，目前存在浏览器里') : '当前浏览器不支持选择文件夹，想法存在浏览器里，可在列表中导出 .md。'}</p>
    ${sf ? `<div class="row"><button id="pick">选择文件夹</button>${store.needsReauth() ? '<button id="reauth">重新授权</button>' : ''}</div>` : ''}
    <h3>📢 我的横幅</h3>
    <div class="row"><input id="banner-input" placeholder="写一句你自己的吐槽…" maxlength="60" style="flex:1;font:inherit;padding:6px;border:2px solid #5a3e1b;border-radius:8px"><button id="banner-add">添加</button></div>
    <div id="banner-mine">${cb.getCustom().map((l, i) => `<div class="note-item"><span class="txt">✍️ ${l.replace(/</g, '&lt;')}</span><button data-i="${i}" title="移除">移除</button></div>`).join('') || '<p style="font-size:12px;color:#888">还没有自定义的句子，默认文案照常播放。</p>'}</div>
    <h3>⌨️ 快捷键</h3><p style="font-size:13px">N（不在输入时）或 Ctrl+Alt+N：新建对话框</p>
    <h3>🔑 DeepSeek 密钥</h3>
    <p style="font-size:12px;color:#888">只保存在本浏览器（localStorage），不会上传到别处，仅在整理时发给 DeepSeek。</p>
    <input type="password" id="key" placeholder="sk-..." value="${ai.getKey()}">
    <div class="row"><button id="save-key">保存密钥</button><button id="clear-key">清除密钥</button></div>`;
  body.querySelector('#pick')?.addEventListener('click', async () => { try { await store.pickFolder(); toast('文件夹已选好，之后的想法会存成 .md'); renderSettings(); } catch {} });
  body.querySelector('#reauth')?.addEventListener('click', async () => { if (await store.reauthorize()) toast('已重新授权'); renderSettings(); });
  body.querySelector('#banner-add').onclick = () => { addBannerLine(body.querySelector('#banner-input').value); renderSettings(); };
  body.querySelectorAll('#banner-mine button').forEach(btn => btn.onclick = () => { cb.removeCustom(cb.getCustom()[btn.dataset.i]); initBanner(); renderSettings(); toast('已从横幅移除'); });
  body.querySelector('#save-key').onclick = () => { ai.setKey(body.querySelector('#key').value); toast('密钥已保存'); };
  body.querySelector('#clear-key').onclick = () => { ai.setKey(''); renderSettings(); toast('密钥已清除'); };
}

(async () => {
  await store.restoreFolder();
  trash.setCount(await store.countNotes());
  fill.renderPile(await store.countUnsorted());
  review.maybeAutoShow(await store.listNotes());
  createBubble(innerWidth * 0.15, innerHeight * 0.22);
  createBubble(innerWidth * 0.6, innerHeight * 0.3);
})();
