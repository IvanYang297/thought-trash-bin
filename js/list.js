// 侧边栏：想法列表（按时间、搜索、删除、勾选用于 AI 整理）
import { listNotes, deleteNote, fmtFull, exportAll } from './storage.js';
export const selected = new Set();
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export async function renderList(body, onChange) {
  body.innerHTML = `<input type="search" id="search" placeholder="搜索想法…">
    <div class="row"><button id="sel-all">全选</button><button id="sel-none">全不选</button><button id="export">导出全部 .md</button></div>
    <div id="items"></div>`;
  const notes = await listNotes();
  const items = body.querySelector('#items');
  const draw = q => {
    const f = notes.filter(n => !q || n.text.toLowerCase().includes(q.toLowerCase()));
    items.innerHTML = f.length ? '' : '<p>还没有想法，或没有搜到～</p>';
    f.forEach(n => {
      const d = document.createElement('div'); d.className = 'note-item';
      d.innerHTML = `<input type="checkbox" ${selected.has(n.id) ? 'checked' : ''}><div class="txt"><time>${fmtFull(n.createdAt)}${n.inFolder ? ' · 📁' : ''}</time>${esc(n.text)}</div><button title="删除">🗑</button>`;
      d.querySelector('input').onchange = e => e.target.checked ? selected.add(n.id) : selected.delete(n.id);
      d.querySelector('button').onclick = async () => {
        if (!confirm('确定删除这条想法吗？')) return;
        await deleteNote(n); selected.delete(n.id); notes.splice(notes.indexOf(n), 1); draw(search.value); onChange?.();
      };
      items.appendChild(d);
    });
  };
  const search = body.querySelector('#search');
  search.oninput = () => draw(search.value);
  body.querySelector('#sel-all').onclick = () => { notes.forEach(n => selected.add(n.id)); draw(search.value); };
  body.querySelector('#sel-none').onclick = () => { selected.clear(); draw(search.value); };
  body.querySelector('#export').onclick = exportAll;
  draw('');
}
