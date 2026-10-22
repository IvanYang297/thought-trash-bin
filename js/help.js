import { t } from './i18n.js';
export const VERSION = 'v1.2';
// 使用须知：鼠标悬停（或键盘聚焦）按钮时弹出的小卡片（新增功能时在 i18n.js 的 help.sections 里中英各补一行）
const SHOW_DELAY = 150, HIDE_DELAY = 200;
export function initHelpPopover(btn, onTour) {
  const pop = document.createElement('div');
  pop.id = 'help-pop'; pop.setAttribute('role', 'tooltip'); pop.tabIndex = -1;
  const render = () => { pop.innerHTML = `<div class="help-title">${t('help.title')} <span class="ver">${VERSION}</span></div>` + t('help.sections').map(([h, items]) =>
    `<section><h4>${h}</h4>${items.map(i => `<p>${i}</p>`).join('')}</section>`).join('') +
    `<p class="help-tour"><button id="help-tour">${t('help.tour')}</button></p><p class="help-foot">${t('help.foot')}</p><p class="help-contact"><a href="https://x.com/PinkY63990316?utm_source=ttb" target="_blank" rel="noopener">${t('help.contact')}</a></p>`;
    pop.querySelector('#help-tour').onclick = () => { pop.classList.remove('show'); onTour?.(); }; };
  render(); document.body.appendChild(pop);
  addEventListener('ttb-lang', () => { render(); if (pop.classList.contains('show')) place(); });
  btn.setAttribute('aria-describedby', 'help-pop'); btn.removeAttribute('title');
  let showT, hideT;
  const place = () => {
    const r = btn.getBoundingClientRect();
    pop.style.top = r.bottom + 8 + 'px';
    pop.style.right = Math.max(8, innerWidth - r.right) + 'px';
  };
  const show = (delay = SHOW_DELAY) => { clearTimeout(hideT); clearTimeout(showT); showT = setTimeout(() => { place(); pop.classList.add('show'); }, delay); };
  const hide = (delay = HIDE_DELAY) => { clearTimeout(showT); clearTimeout(hideT); hideT = setTimeout(() => pop.classList.remove('show'), delay); };
  btn.addEventListener('mouseenter', () => show());
  btn.addEventListener('mouseleave', () => hide());
  pop.addEventListener('mouseenter', () => clearTimeout(hideT));
  pop.addEventListener('mouseleave', () => hide());
  btn.addEventListener('focus', () => show(0));
  btn.addEventListener('blur', () => hide());
  btn.addEventListener('click', e => { e.preventDefault(); show(0); }); // 点击也只是显示小卡片，不开大面板
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pop.classList.contains('show')) { clearTimeout(showT); pop.classList.remove('show'); } });
  addEventListener('resize', () => pop.classList.contains('show') && place());
  return pop;
}
