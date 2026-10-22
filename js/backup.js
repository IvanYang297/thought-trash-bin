import { t, isEn, LANG } from './i18n.js';
// 备份提醒：没选文件夹时，未备份的想法攒到 10 条（之后每多 20 条）弹一个小提示，可一键导出
import { countUnbacked, exportAll, folderName } from './storage.js';
const KEY = 'ttb.nudged';
export const nextThreshold = last => last ? last + 20 : 10;
export async function maybeNudge() {
  if (folderName()) return false;
  const n = await countUnbacked(), last = +localStorage.getItem(KEY) || 0;
  if (n < nextThreshold(last)) return false;
  let t = n >= 10 ? 10 + Math.floor((n - 10) / 20) * 20 : 10; // 跨过多个档位时只提醒一次
  localStorage.setItem(KEY, String(t)); show(n); return true;
}
addEventListener('ttb-lang', () => { const el = document.getElementById('backup-nudge'); if (el) show(+el.dataset.n); });
function show(n) {
  document.getElementById('backup-nudge')?.remove();
  const el = document.createElement('div'); el.id = 'backup-nudge'; el.setAttribute('role', 'status');
  el.dataset.n = n;
  el.innerHTML = `<span>${t('nudge.text', { n })}</span><button class="go">${t('nudge.go')}</button><button class="x" aria-label="${t('nudge.close')}">✕</button>`;
  document.body.appendChild(el);
  el.querySelector('.go').onclick = async () => { await exportAll(); el.remove(); };
  el.querySelector('.x').onclick = () => el.remove();
}
