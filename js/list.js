import { t } from './i18n.js';
// 侧边栏：想法列表（按时间、搜索、删除、勾选用于 AI 整理）
import { TAGS, tagLabel } from './tags.js';
import { listNotes, deleteNote, fmtFull, exportAll } from './storage.js';
export const selected = new Set();
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let renderSeq = 0;
export async function renderList(body, onChange, onBanner) {
  const seq = ++renderSeq;
  body.classList.add('fixed-controls'); // 搜索/筛选固定，只有列表滚动
  body.innerHTML = `<input type="search" id="search" placeholder="${t('list.search')}">
    <select id="tag-filter"><option value="">${t('list.allTags')}</option>${Object.entries(TAGS).map(([k, g]) => `<option value="${k}">${g.emoji} ${g.name}</option>`).join('')}<option value="none">${t('tag.none')}</option></select>
    <div class="row"><button id="sel-all">${t('list.selAll')}</button><button id="sel-none">${t('list.selNone')}</button><button id="export">${t('list.export')}</button></div>
    <div id="items"></div>`;
  const notes = await listNotes();
  if (seq !== renderSeq || !body.querySelector('#items')) return; // 已被更新的渲染取代
  const items = body.querySelector('#items');
  const draw = q => {
    const tf = body.querySelector('#tag-filter').value;
    const f = notes.filter(n => (!q || n.text.toLowerCase().includes(q.toLowerCase())) && (!tf || (tf === 'none' ? !n.tag : n.tag === tf)));
    items.innerHTML = f.length ? '' : `<p class="empty">${notes.length ? t('list.noMatch') : t('list.empty')}</p>`;
    f.forEach(n => {
      const d = document.createElement('div'); d.className = 'note-item';
      d.innerHTML = `<input type="checkbox" ${selected.has(n.id) ? 'checked' : ''}><div class="txt"><time>${fmtFull(n.createdAt)}${n.inFolder ? ' · 📁' : ''} · ${tagLabel(n.tag)}</time>${esc(n.text)}</div><div class="acts"><button class="to-banner" title="${t('list.toBanner.title')}">${t('list.toBanner')}</button><button class="del" title="${t('list.del')}" aria-label="${t('list.del')}">🗑</button></div>`;
      d.querySelector('input').onchange = e => e.target.checked ? selected.add(n.id) : selected.delete(n.id);
      d.querySelector('.to-banner').onclick = () => onBanner?.(n.text);
      // 不用原生 confirm()：部分浏览器/内置浏览器会静默屏蔽弹窗并直接返回 false，导致「点了没反应」
      d.querySelector('.del').onclick = () => {
        const acts = d.querySelector('.acts');
        acts.innerHTML = `<span class="ask">${t('list.ask')}</span><button class="yes">${t('list.yes')}</button><button class="no">${t('list.no')}</button>`;
        acts.querySelector('.no').onclick = () => draw(search.value);
        acts.querySelector('.yes').onclick = async () => {
          await deleteNote(n); selected.delete(n.id); notes.splice(notes.indexOf(n), 1); draw(search.value); onChange?.();
        };
      };
      items.appendChild(d);
    });
  };
  const search = body.querySelector('#search');
  search.oninput = () => draw(search.value);
  body.querySelector('#tag-filter').onchange = () => draw(search.value);
  body.querySelector('#sel-all').onclick = () => { notes.forEach(n => selected.add(n.id)); draw(search.value); };
  body.querySelector('#sel-none').onclick = () => { selected.clear(); draw(search.value); };
  body.querySelector('#export').onclick = exportAll;
  draw('');
}
