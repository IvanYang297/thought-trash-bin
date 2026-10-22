# 更新记录 · Changelog

## v1.2.1（2026-10-22）
- 英文文案润色：计数改为 "Eaten: N thoughts"；"Secret" 标签改为 "Deep thoughts"；AI 按钮改为 "🤖 AI sort-out"；使用须知联系方式改为 "Ideas? Bugs? Find me on X."
- English copy polish: counter reads "Eaten: N thoughts"; the "Secret" tag is now "Deep thoughts"; the AI button is "🤖 AI sort-out"; the help contact line is "Ideas? Bugs? Find me on X."

## v1.2（2026-10-22）
**新增：中英双语 · New: Chinese / English**
- 按浏览器语言自动切换：中文环境（zh 开头）显示中文，其他显示英文；只看浏览器设置，不查 IP、不发任何网络请求。
  Follows the browser language: `zh*` shows Chinese, everything else English. Uses only the browser setting — no IP lookup, no network requests.
- 工具栏和欢迎页右上角都有「中 / EN」按钮，随时切换，不刷新页面，正在写的内容不会丢；选择会记住。
  A "中 / EN" button on the toolbar and the welcome page switches instantly without reloading or losing what you're typing; the choice is remembered.
- 全部界面文字都有英文版：欢迎页、工具栏、对话框、心情标签、想法列表、设置、AI 整理、引导、使用须知、备份提醒、本周回顾卡片和 PNG、彩蛋、打嗝提示；日期按语言显示。
  All UI text is translated: welcome page, toolbar, cards, mood tags, list, settings, AI sort-out, tour, help, backup reminder, weekly recap card and PNG, easter eggs, burp messages; dates are localized.
- 英文横幅是另写的英文职场吐槽，不是直译；自己加的横幅句子保持原样。
  English banner lines are written fresh, not translated; your own banner lines stay as-is.
- 两段复制提示词（AI 整理、玄学解读）有英文版，玄学版同样注明仅供娱乐。
  Both copyable prompts (AI sort-out, fortune) have English versions; the fortune one is still marked just for fun.
- 英文环境下页面标题、简介和分享标签也换成英文。
  Page title, description and share tags switch to English too.

**改动 · Changes**
- 作者信息改成 X 和 GitHub 两个小图标，鼠标停留有提示。
  Author info is now two small icons, X and GitHub, with hover tips.
- 手机窄屏下工具栏换成两行，长按钮不会挤出屏幕。
  On narrow phone screens the toolbar wraps to two rows so long buttons fit.

## v1.1.1（2026-10-22）
- 本周回顾图片底部加印网址，转发图片也能找到网站。
  The weekly recap image now shows the site address at the bottom.
- 新增作者 X / GitHub 链接（主页、欢迎页、使用须知、README）。
  Added author X / GitHub links (main page, welcome page, help, README).

## v1.1（2026-10-22）
**修复 · Fixes**
- 想法列表里删除没反应：改成卡片内确认，确认后同时删除浏览器和文件夹里的 `.md`，计数一起更新。
  Delete in the list did nothing: now confirms inside the card and removes the note from both the browser and the folder, updating the count.
- 窗口较矮时第二次打开列表偶尔空白：已修复。
  The list sometimes showed blank on second open in short windows: fixed.

**新增 · New**
- 第一次打开有落地页和 7 步新手引导，可跳过，「使用须知」里可重看。
  First visit shows a landing page and a 7-step tour (skippable, replayable from Help).
- 首屏标题和一句话说明。
  A title and one-line pitch on the first screen.
- 本周回顾「📤 分享」：手机直接带图分享，电脑下载图片并复制网址。
  Weekly recap "📤 Share": shares the image on phones; downloads it and copies the link on desktop.
- 工具栏「💾 导出备份」，未备份的想法攒到 10 条（之后每 20 条）会提示。
  "💾 Export backup" in the toolbar, with a reminder at 10 unbacked notes (then every 20).
- 分享卡片、网站图标、robots.txt、sitemap.xml。
  Share preview card, favicon, robots.txt, sitemap.xml.

## v1.0（2026-10-21）
首个公开版本：写想法、拖进垃圾桶保存、心情标签、会变表情的桶、纸片彩蛋、想法列表、本周回顾、AI 整理与玄学解读提示词、自定义横幅、快捷键。
First release: write notes, drag them into the bin to save, mood tags, a bin with changing faces, paper-burst easter egg, notes list, weekly recap, AI sort-out and fortune prompts, custom banner, shortcuts.
