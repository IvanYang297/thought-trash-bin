# 🗑️ 思绪垃圾桶

作者：[@IvanYang297](https://github.com/IvanYang297) ｜ X：[@PinkY63990316](https://x.com/PinkY63990316)

一个把乱糟糟的想法、上班吐槽、心里话随手“丢掉”的小网页。丢进去的东西不会消失，而是存成 Markdown 文件，需要时还能让 AI 帮你整理成计划。

![截图](docs/screenshot.png)

当前版本 **v1.2**（中文 / English 双语）（更新记录见 [CHANGELOG.md](CHANGELOG.md)）。在线体验：<https://thought-trash-bin.pages.dev>

| 第一次打开：新手引导 | 分享卡片（og:image） |
|---|---|
| ![引导](docs/onboarding.png) | ![分享图](docs/og-image.png) |

| 满 20 条：盖子合不上 | 本周回顾卡片 |
|---|---|
| ![满桶](docs/can-20.png) | ![回顾卡片](docs/review-card.png) |

## 功能（第一版）
- **滚动吐槽横幅**：顶部循环播放吐槽上班的句子（默认文案在 `js/i18n.js` 的 `banner.lines`，中英各一组）。
- **冒险岛风格对话框**：圆角粗描边、带小尖角、轻轻漂浮；点空白处或右下角「+」新建，直接打字，可拖动。
- **丢进垃圾桶**：把对话框拖进底部的大垃圾桶就保存，桶会“嚼嚼嚼”，显示「已吃掉 N 条」。
- **彩蛋**：双击垃圾桶，或 2 秒内连点 5 下，纸片爆出来，上面写着日期时间和当时的想法。
- **本地保存**：Edge / Chrome 可在「设置」里选一个文件夹，每条想法存成一个 `.md`；其他浏览器存在浏览器里（IndexedDB），可在列表里「导出全部 .md」。
- **想法列表**：按时间倒序查看，可搜索、删除、勾选。
- **AI 整理**：在「设置」里填 DeepSeek 密钥（只存在本浏览器），一键把想法整理成项目 / 步骤 / 优先级，结果存成 `.md`。没有密钥时可「一键复制整理提示词」，贴到豆包或 WorkBuddy。
- **玄学解读（仅供娱乐）**：AI 整理面板里点「🔮 复制玄学解读提示词」，贴给 DeepSeek / 豆包，得到今日签文、宜忌、幸运色和 3 条现实小建议。
- **心情标签**：每个对话框可选 😤 吐槽 / 💡 灵感 / 😢 心里话（默认无），标签写进 `.md` 开头的 front matter；爆出的纸片按标签着色；列表可按标签筛选。
- **越吃越满**：桶会表情变化——有没整理的想法就不开心，AI 整理完又笑了；满 20 条盖子合不上、纸团从边上挤出来并打嗝提醒；超过 100 条纸团狂喷、盖子拼命往下压又被顶起来。
- **本周回顾**：顶部「📅 本周回顾」查看本周各标签条数和总数的卡片，可下载 PNG 分享；每周五第一次打开时自动弹出一次。
- **三连击 / 上限**：在对话框上快速连点三下，它会自己飞进桶里；屏幕上最多 10 个对话框。鼠标停在右上角「使用须知」上会弹出小卡片列出所有操作，Esc 关闭。
- **快捷键**：没在打字时按 **N**，或随时按 **Ctrl+Alt+N**，新建一个对话框并直接开始输入。
- **自定义横幅**：在「设置 → 我的横幅」里写自己的吐槽，或在想法列表里点「加到横幅」；和默认文案混着播放，可随时移除（存在浏览器 localStorage）。
- **v1.1 新增**：首次打开有落地页和 7 步新手引导（可跳过，「使用须知」里能重看）；首屏有标题和一句话说明；本周回顾可「📤 分享」（手机上直接带图分享，电脑上下载图片并复制网址）；工具栏「💾 导出备份」，没选文件夹时未备份想法攒到 10 条（之后每 20 条）会小提示；补了分享卡片、图标和搜索引擎基础文件。修好了列表里删除没反应、第二次打开列表偶发空白。
- **v1.2 新增：中英双语**：按浏览器语言自动选择（中文系统显示中文，其余显示英文），不查 IP、不联网；右上角「中 / EN」随时切换，选择会记住。所有界面文字、引导、使用须知、本周回顾图、两段 AI 提示词都有英文版。文案集中在 `js/i18n.js`，对照表见 [docs/i18n-review.md](docs/i18n-review.md)。页脚作者信息改成 X / GitHub 两个小图标。
- **离线可用**：除了 AI 整理，全部功能不需要联网。

## 怎么运行
因为用了 ES 模块，需要通过本地服务器打开（直接双击 `index.html` 不行）：

```bash
cd thought-trash-bin
python3 -m http.server 8000
```
然后用 Edge 或 Chrome 打开 <http://localhost:8000>。

也可以直接部署到 GitHub Pages：仓库设置 → Pages → 选择分支根目录即可。

## 目录结构
```
index.html          页面
css/style.css       样式
js/main.js          入口，把各模块串起来
js/i18n.js          中英文案词典 + t() + 语言检测/切换
js/banner.js        滚动横幅
js/bubbles.js       漂浮对话框
js/trashbin.js      垃圾桶、计数、咀嚼动画
js/storage.js       IndexedDB / 文件夹 .md 保存与导出
js/list.js          想法列表
js/ai.js            DeepSeek 整理与提示词
js/mystic-prompt.js 玄学解读提示词（仅供娱乐）
js/easter-eggs.js   纸片爆炸彩蛋
js/tags.js          心情标签
js/fill.js          越吃越满 / 打嗝
js/face.js          垃圾桶表情平滑过渡
assets/can/         垃圾桶美术（四个状态的 SVG / PNG）
js/review.js        本周回顾卡片
js/shortcuts.js     快捷键
js/help.js          使用须知悬停小卡片
js/custom-banner.js 自定义横幅
js/tour.js          落地页 + 新手引导
js/backup.js        备份提醒
favicon.svg / robots.txt / sitemap.xml / assets/og-image.png  图标与 SEO
tests/smoke_test.py 自动化冒烟测试（Playwright）
```
每个功能一个文件，以后加新想法时通常只需新增一个模块，再在 `main.js` 里接上，不容易牵一发动全身。

## 测试
```bash
pip install playwright && python3 -m playwright install chromium
python3 tests/smoke_test.py
```

## 隐私
想法只保存在你的电脑 / 浏览器里。DeepSeek 密钥只存在浏览器 localStorage，仅在你点击「AI 整理」时随请求发送给 DeepSeek。

本站使用 Cloudflare Web Analytics，仅用于匿名访问统计，不上传任何想法内容。

## 许可证
MIT

## English

**Thought Trash Bin** — rants, ideas, 3am thoughts. Write it, toss it, feel lighter.

Author: [@IvanYang297](https://github.com/IvanYang297) · X: [@PinkY63990316](https://x.com/PinkY63990316) · Live: <https://thought-trash-bin.pages.dev>

A tiny web page where you scribble thoughts on floating cards and drag them into a cartoon trash bin. Nothing is really thrown away: notes are saved in your browser (or as Markdown files in a folder you pick in Chrome/Edge). Get a weekly recap image, search and export everything, or copy a ready-made prompt to let an AI turn the mess into a to-do list (plus a just-for-fun "office fortune" prompt).

- Bilingual (v1.2): follows your browser language (any `zh*` → Chinese, otherwise English), switch anytime with **中 / EN** in the top-right. No IP lookup, no network calls.
- Free, no sign-up, works offline (except AI tidy-up). Your notes never leave your browser.
- Run locally: `python3 -m http.server 8000` in the repo folder, then open <http://localhost:8000>.
- Translations live in `js/i18n.js`; side-by-side review sheet: `docs/i18n-review.md`.

![English screenshot](docs/screenshot-en.png)

