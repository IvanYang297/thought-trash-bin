// 使用须知：鼠标悬停（或键盘聚焦）按钮时弹出的小卡片（新增功能时在这里补一行）
const SECTIONS = [
  ['✍️ 写想法', ['点空白处 / <b>+</b> / <kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>：新建', '最多 <b>10</b> 个对话框；✕ 直接扔掉', '心情标签：😤 吐槽 · 💡 灵感 · 😢 心里话']],
  ['🗑️ 丢进桶', ['<b>拖进</b>垃圾桶，或<b>连点三下</b>对话框：保存', '空的不吃，会弹回来', '<b>双击</b>桶 / 2 秒<b>连点 5 下</b>：纸片爆出来', '没整理的多了桶会不开心；20 条打嗝，100 条喷纸']],
  ['📜 列表', ['搜索、按标签筛选、删除', '「加到横幅」·「导出全部 .md」']],
  ['🤖 AI整理', ['设置里填 DeepSeek 密钥后一键整理', '没密钥：一键复制整理提示词 → 豆包 / WorkBuddy']],
  ['📅 本周回顾', ['各标签统计，可下载 PNG；周五自动弹一次']],
  ['⚙ 设置', ['选保存文件夹 · 我的横幅 · 密钥']],
  ['⌨️ 快捷键', ['<kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> 新建 · <kbd>Esc</kbd> 关闭面板 / 本卡片']],
];
const SHOW_DELAY = 150, HIDE_DELAY = 200;
export function initHelpPopover(btn) {
  const pop = document.createElement('div');
  pop.id = 'help-pop'; pop.setAttribute('role', 'tooltip'); pop.tabIndex = -1;
  pop.innerHTML = `<div class="help-title">使用须知</div>` + SECTIONS.map(([h, items]) =>
    `<section><h4>${h}</h4>${items.map(i => `<p>${i}</p>`).join('')}</section>`).join('') +
    `<p class="help-foot">除了 AI 整理，全部可离线使用<br>本站使用 Cloudflare Web Analytics，仅用于匿名访问统计，不上传任何想法内容。</p>`;
  document.body.appendChild(pop);
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
