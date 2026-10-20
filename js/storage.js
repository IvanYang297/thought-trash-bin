// 存储：所有想法都存一份在 IndexedDB（用于列表/搜索）；
// 若在 Edge/Chrome 中选择了文件夹，同时把每条写成 .md 文件。
const DB_NAME = 'thought-trash-bin', DB_VER = 1;
let dbPromise;
function db() {
  dbPromise ??= new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = () => {
      r.result.createObjectStore('notes', { keyPath: 'id' });
      r.result.createObjectStore('kv');
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbPromise;
}
async function tx(store, mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction(store, mode);
    const req = fn(t.objectStore(store));
    t.oncomplete = () => res(req?.result);
    t.onerror = () => rej(t.error);
  });
}
const kvGet = k => tx('kv', 'readonly', s => s.get(k));
const kvSet = (k, v) => tx('kv', 'readwrite', s => s.put(v, k));

export const pad = n => String(n).padStart(2, '0');
export function fmtShort(ts) { const d = new Date(ts); return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`; }
export function fmtFull(ts) { const d = new Date(ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
function fileName(ts, prefix = '想法') { const d = new Date(ts); return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${d.getMilliseconds()}.md`; }
export const noteToMd = n => `# ${fmtFull(n.createdAt)}\n\n${n.text}\n`;

export const supportsFolder = () => 'showDirectoryPicker' in window;
let dirHandle = null;
export const folderName = () => dirHandle?.name || null;

export async function restoreFolder() {
  if (!supportsFolder()) return null;
  const h = await kvGet('dirHandle').catch(() => null);
  if (h && (await h.queryPermission({ mode: 'readwrite' })) === 'granted') dirHandle = h;
  else if (h) dirHandle = null, pendingHandle = h;
  return dirHandle;
}
let pendingHandle = null;
// 浏览器重启后需用户点一下才能重新授权
export async function reauthorize() {
  if (!pendingHandle) return false;
  if ((await pendingHandle.requestPermission({ mode: 'readwrite' })) === 'granted') { dirHandle = pendingHandle; pendingHandle = null; return true; }
  return false;
}
export const needsReauth = () => !!pendingHandle;
export async function pickFolder() {
  const h = await window.showDirectoryPicker({ mode: 'readwrite', id: 'thought-trash-bin' });
  dirHandle = h; pendingHandle = null; await kvSet('dirHandle', h); return h;
}

async function writeFile(name, content) {
  if (!dirHandle) return false;
  try {
    const fh = await dirHandle.getFileHandle(name, { create: true });
    const w = await fh.createWritable(); await w.write(content); await w.close(); return true;
  } catch (e) { console.warn('写入文件夹失败，已保存在浏览器里', e); return false; }
}

export async function saveNote(text) {
  const createdAt = Date.now();
  const note = { id: `${createdAt}-${Math.random().toString(36).slice(2, 7)}`, createdAt, text, file: fileName(createdAt) };
  note.inFolder = await writeFile(note.file, noteToMd(note));
  await tx('notes', 'readwrite', s => s.put(note));
  return note;
}
export async function listNotes() {
  const all = await tx('notes', 'readonly', s => s.getAll());
  return all.sort((a, b) => b.createdAt - a.createdAt);
}
export async function countNotes() { return tx('notes', 'readonly', s => s.count()); }
export async function deleteNote(note) {
  await tx('notes', 'readwrite', s => s.delete(note.id));
  if (dirHandle && note.inFolder) await dirHandle.removeEntry(note.file).catch(() => {});
}
export async function saveResult(md) {
  const name = fileName(Date.now(), 'AI整理');
  const ok = await writeFile(name, md);
  if (!ok) download(name, md);
  return { name, inFolder: ok };
}
export function download(name, content) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export async function exportAll() {
  const notes = await listNotes();
  const md = `# 思绪垃圾桶 导出（共 ${notes.length} 条）\n\n` + notes.map(n => `## ${fmtFull(n.createdAt)}\n\n${n.text}\n`).join('\n---\n\n');
  download(fileName(Date.now(), '全部想法'), md);
}
