import { t, applyStatic, toggleLang } from './i18n.js';
import { buildMysticPrompt } from './mystic-prompt.js';
// 入口：把各模块串起来。新功能建议新建一个模块文件，再在这里接上。
import { initBanner } from './banner.js';
import { initBubbles, createBubble, relabelBubbles } from './bubbles.js';
import { relabelTags } from './tags.js';
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
import { initLanding, startTour } from './tour.js';
import { maybeNudge } from './backup.js';

const $ = s => document.querySelector(s);
export function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms); }

applyStatic();
addEventListener('ttb-toast', e => toast(e.detail, 3000));
initBanner($('#banner'));
trash.initTrash({ onBurst: async () => explode(await store.listNotes(), trash.trashCenter()) });
initBubbles($('#stage'), {
  getTrashRect: trash.getTrashRect, inTrash: trash.inTrash, trashCenter: trash.trashCenter, onHover: trash.setHover,
  onLimit: () => toast(t('toast.limit')),
  onEmpty: () => toast(t('toast.empty')),
  onDrop: async (b, text, tag) => {
    b.remove(); trash.chew();
    try { const n = await store.saveNote(text, tag); trash.setCount(await store.countNotes()); toast(n.inFolder ? t('toast.savedFolder') : t('toast.savedBrowser'));
      const u = await store.countUnsorted(); fill.renderPile(u, { afterChew: true }); if (fill.shouldBurp(u)) setTimeout(() => fill.burp(toast), 1000); refreshPanel(); maybeNudge(); }
    catch (e) { console.error(e); toast(t('toast.saveFail', { msg: e.message })); }
  },
});
$('#btn-add').onclick = () => createBubble();
initShortcuts(() => createBubble());
function addBannerLine(line) { if (cb.addCustom(line)) { initBanner(); toast(t('toast.bannerAdded')); } else toast(t('toast.bannerDup')); }

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
  // 列表需要至少约 300px 才能放下搜索栏和几条想法；太矮时宁可盖住桶顶一点，也不能把列表挤成 0 高度（空白）
  panel.style.maxHeight = Math.max(current === 'list' ? 300 : 140, maxH) + 'px';
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
$('#btn-backup').onclick = async () => { await store.exportAll(); document.getElementById('backup-nudge')?.remove(); toast(t('toast.backupDone')); };
initHelpPopover($('#btn-help'), () => startTour(0));
$('#btn-lang').onclick = () => { toggleLang(); toast(t('lang.switched')); };
// 切换语言：不刷新页面，重绘横幅 / 面板 / 对话框提示语（已输入的文字不动）
addEventListener('ttb-lang', () => { initBanner(); relabelBubbles(); relabelTags(); if (current) { refreshPanel(); requestAnimationFrame(placePanel); } });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('review')) return document.getElementById('review').remove();
  if (current) closePanel();
});
async function refreshPanel() {
  if (!current) return;
  body.classList.remove('fixed-controls');
  $('#panel-title').textContent = t('panel.' + current);
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
  if (current !== 'ai') return;
  body.innerHTML = `<p>${t('ai.count', { n: notes.length, which: selected.size ? t('ai.picked') : t('ai.all') })}</p>
    <div class="row"><button id="go">${t('ai.go')}</button><button id="copy">${t('ai.copy')}</button><button id="mystic">${t('ai.mystic')}</button></div>
    <p style="font-size:12px;color:#888">${t('ai.noKeyHint')}</p><div id="out"></div>`;
  body.querySelector('#copy').onclick = async () => { await ai.copyPrompt(notes); toast(t('toast.promptCopied')); };
  body.querySelector('#mystic').onclick = async () => { await ai.copyText(buildMysticPrompt(notes)); toast(t('toast.promptCopied')); };
  body.querySelector('#go').onclick = async () => {
    if (!notes.length) return toast(t('toast.noNotes'));
    const out = body.querySelector('#out'); out.textContent = t('ai.thinking');
    try {
      const md = await ai.organize(notes);
      await store.markOrganized(notes.map(n => n.id)); fill.renderPile(await store.countUnsorted());
      const f = await store.saveResult(`# ${t('ai.resultTitle')} (${store.fmtFull(Date.now())})\n\n${md}\n`);
      out.innerHTML = ''; const pre = document.createElement('pre'); pre.className = 'result'; pre.textContent = md; out.appendChild(pre);
      toast(f.inFolder ? t('toast.savedTo', { name: f.name }) : t('toast.downloaded', { name: f.name }));
    } catch (e) { out.textContent = e.message; }
  };
}
function renderSettings() {
  const sf = store.supportsFolder();
  body.innerHTML = `<h3>${t('set.folder.h')}</h3>
    <p>${sf ? (store.folderName() ? t('set.folder.cur', { name: store.folderName() }) : store.needsReauth() ? t('set.folder.reauth') : t('set.folder.none')) : t('set.folder.unsupported')}</p>
    ${sf ? `<div class="row"><button id="pick">${t('set.folder.pick')}</button>${store.needsReauth() ? `<button id="reauth">${t('set.folder.reauthBtn')}</button>` : ''}</div>` : ''}
    <h3>${t('set.banner.h')}</h3>
    <div class="row"><input id="banner-input" placeholder="${t('set.banner.ph')}" maxlength="60" style="flex:1;font:inherit;padding:6px;border:2px solid #5a3e1b;border-radius:8px"><button id="banner-add">${t('set.banner.add')}</button></div>
    <div id="banner-mine">${cb.getCustom().map((l, i) => `<div class="note-item"><span class="txt">✍️ ${l.replace(/</g, '&lt;')}</span><button data-i="${i}" title="${t('set.banner.remove')}">${t('set.banner.remove')}</button></div>`).join('') || `<p style="font-size:12px;color:#888">${t('set.banner.none')}</p>`}</div>
    <h3>${t('set.keys.h')}</h3><p style="font-size:13px">${t('set.keys.p')}</p>
    <h3>${t('set.key.h')}</h3>
    <p style="font-size:12px;color:#888">${t('set.key.p')}</p>
    <input type="password" id="key" placeholder="sk-..." value="${ai.getKey()}">
    <div class="row"><button id="save-key">${t('set.key.save')}</button><button id="clear-key">${t('set.key.clear')}</button></div>`;
  body.querySelector('#pick')?.addEventListener('click', async () => { try { await store.pickFolder(); toast(t('toast.folderPicked')); renderSettings(); } catch {} });
  body.querySelector('#reauth')?.addEventListener('click', async () => { if (await store.reauthorize()) toast(t('toast.reauthed')); renderSettings(); });
  body.querySelector('#banner-add').onclick = () => { addBannerLine(body.querySelector('#banner-input').value); renderSettings(); };
  body.querySelectorAll('#banner-mine button').forEach(btn => btn.onclick = () => { cb.removeCustom(cb.getCustom()[btn.dataset.i]); initBanner(); renderSettings(); toast(t('toast.bannerRemoved')); });
  body.querySelector('#save-key').onclick = () => { ai.setKey(body.querySelector('#key').value); toast(t('toast.keySaved')); };
  body.querySelector('#clear-key').onclick = () => { ai.setKey(''); renderSettings(); toast(t('toast.keyCleared')); };
}

(async () => {
  await store.restoreFolder();
  trash.setCount(await store.countNotes());
  fill.renderPile(await store.countUnsorted());
  review.maybeAutoShow(await store.listNotes());
  createBubble(innerWidth * 0.15, innerHeight * 0.22);
  createBubble(innerWidth * 0.6, innerHeight * 0.3);
  initLanding();
})();
