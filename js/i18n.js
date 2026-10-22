// 多语言：中文 / English。按浏览器语言自动选（任何 zh* → 中文，其余 → 英文），不查 IP、不发网络请求；
// 右上角「中 / EN」可手动切换，选择存在 localStorage，优先于自动检测。
// 每个词条：[中文, English]。要改文案直接改这里（docs/i18n-review.md 是对照表）。
const KEY = 'ttb.lang';
export const D = {
  // ---- 页面 head ----
  'doc.title': ['思绪垃圾桶 · 烦心事、灵感、心里话，写下来，扔进桶里', 'Thought Trash Bin · Rants, ideas, 3am thoughts. Write it, toss it.'],
  'meta.desc': ['一个会“吃”想法的垃圾桶：随手写、拖进去、每周看回顾，还能交给 AI 帮你理清。免费，不用注册。', 'A trash bin that eats your thoughts: scribble, drag it in, get a weekly recap, and let AI sort the mess. Free, no sign-up.'],
  // ---- 语言切换 ----
  'lang.aria': ['切换语言 / Switch language', 'Switch language / 切换语言'],
  'lang.switched': ['已切换到中文', 'Switched to English'],
  // ---- 首屏 / 工具栏 ----
  'banner.aria': ['吐槽横幅', 'Rant ticker'],
  'tb.list': ['📜 想法列表', '📜 My notes'],
  'tb.review': ['📅 本周回顾', '📅 Weekly recap'],
  'tb.review.title': ['本周回顾卡片（每周五自动弹出）', 'Weekly recap card (pops up every Friday)'],
  'tb.ai': ['🤖 AI整理', '🤖 AI sort-out'],
  'tb.backup': ['💾 导出备份', '💾 Back up'],
  'tb.backup.title': ['把全部想法导出成一个 .md 文件，换浏览器或清缓存也不怕丢', 'Export everything as one .md file, so switching browsers or clearing cache won\'t eat it'],
  'tb.settings': ['⚙ 设置', '⚙ Settings'],
  'tb.help': ['❓ 使用须知', '❓ Help'],
  'tb.help.aria': ['使用须知：所有操作和快捷键', 'Help: every trick and shortcut'],
  'hero.aria': ['简介', 'About'],
  'hero.brand': ['🗑️ 思绪垃圾桶', '🗑️ Thought Trash Bin'],
  'hero.headline': ['烦心事、灵感、心里话，写下来，扔进桶里。', 'Rants, ideas, 3am thoughts. Write it, toss it, feel lighter.'],
  'hero.sub': ['拖进垃圾桶就保存，双击桶有惊喜。数据只存在你自己的浏览器里。', 'Drop it in the bin to save. Double-click the bin for a surprise. Your stuff never leaves your browser.'],
  'stage.title': ['点空白处写一条新想法', 'Click any empty spot to write a new thought'],
  'add.title': ['新建对话框（快捷键 N 或 Ctrl+Alt+N）', 'New card (shortcut: N or Ctrl+Alt+N)'],
  'trash.title': ['把对话框拖进来；双击或狂点有惊喜', 'Drag cards in here. Double-click or spam-click for a surprise'],
  'counter.pre': ['已吃掉', 'Eaten:'],
  'counter.post': ['条', 'thoughts'],
  'panel.close': ['关闭', 'Close'],
  'author.x': ['来 X 找我聊', 'Chat with me on X'],
  'author.gh': ['看看源码', 'View on GitHub'],
  // ---- 欢迎页 ----
  'land.title': ['思绪垃圾桶', 'Thought Trash Bin'],
  'land.intro': ['烦心事、灵感、心里话，写下来，扔进桶里。', 'Rants, ideas, 3am thoughts. Write it, toss it, feel lighter.'],
  'land.enter': ['进入垃圾桶 →', 'Open the bin →'],
  'land.small': ['免费，不用注册，内容只存在你自己的浏览器里。', 'Free, no sign-up. Everything stays in your own browser.'],
  'land.what.h': ['这是什么', 'What is this?'],
  'land.what.p': ['一个会“吃”想法的网页垃圾桶：把脑子里乱糟糟的念头写在卡片上，拖进桶里就自动保存。之后可以搜索、导出、每周生成一张回顾图，也能一键交给 DeepSeek 等 AI 帮你理成要做的事。', 'A web trash bin that eats your thoughts. Dump whatever\'s rattling around your head onto a card, drag it into the bin, and it\'s saved. Later you can search it, export it, make a weekly recap image, or hand the whole pile to an AI like DeepSeek to turn it into a to-do list.'],
  'land.who.h': ['适合谁', 'Who is it for?'],
  'land.who.p': ['上班时脑子停不下来的打工人、想随手记灵感又懒得开笔记软件的人、需要找个地方吐槽和说心里话的人。', 'Office workers whose brains won\'t shut up during work, people who want to catch ideas without opening a "real" notes app, and anyone who just needs somewhere to vent.'],
  'land.skip': ['跳过', 'Skip'],
  // ---- 对话框 / 标签 ----
  'bubble.grip': ['⠿ 拖我进垃圾桶', '⠿ Drag me to the bin'],
  'bubble.close': ['不要了', 'Nah, toss it'],
  'bubble.hints': [['想到啥写啥…', '吐个槽吧…', '心里话放这里…', '老板今天又说啥了？', '脑子里乱糟糟的，倒出来吧…', '一个突发奇想…', '今天最想吐槽的一件事…', '偷偷写，桶不会说出去的～'],
    ['Type whatever…', 'Go on, vent…', 'Secrets go here…', 'What did the boss say this time?', 'Brain full? Pour it out…', 'A random shower thought…', 'The #1 thing that annoyed you today…', 'Psst, the bin won\'t tell anyone~']],
  'tag.rant': ['吐槽', 'Rant'],
  'tag.idea': ['灵感', 'Idea'],
  'tag.heart': ['心里话', 'Deep thoughts'],
  'tag.none': ['无标签', 'No tag'],
  'tag.picked': ['已选：{name}', 'Tagged: {name}'],
  'tag.cleared': ['已取消', 'Tag removed'],
  // ---- 提示 toast ----
  'toast.limit': ['最多 10 个对话框，先丢几个进桶吧～', 'Max 10 cards. Toss a few into the bin first~'],
  'toast.empty': ['空的对话框，桶不吃哦～先写点什么吧', 'Empty card? The bin\'s not eating that. Write something first~'],
  'toast.savedFolder': ['嚼嚼嚼…已存进文件夹 📁', 'Nom nom nom… saved to your folder 📁'],
  'toast.savedBrowser': ['嚼嚼嚼…已存在浏览器里', 'Nom nom nom… saved in your browser'],
  'toast.saveFail': ['保存失败：{msg}', 'Couldn\'t save: {msg}'],
  'toast.bannerAdded': ['已加到横幅 ✍️', 'Added to the ticker ✍️'],
  'toast.bannerDup': ['这句已经在横幅里了（或为空）', 'That line\'s already on the ticker (or it\'s empty)'],
  'toast.bannerRemoved': ['已从横幅移除', 'Removed from the ticker'],
  'toast.backupDone': ['已导出全部想法（.md），存好这个文件就不怕丢', 'Exported everything (.md). Keep that file safe and nothing\'s lost'],
  'toast.promptCopied': ['提示词已复制，去粘贴吧～', 'Prompt copied. Go paste it~'],
  'toast.noNotes': ['还没有想法可以整理', 'Nothing to sort out yet'],
  'toast.savedTo': ['已保存到文件夹：{name}', 'Saved to folder: {name}'],
  'toast.downloaded': ['已下载：{name}', 'Downloaded: {name}'],
  'toast.folderPicked': ['文件夹已选好，之后的想法会存成 .md', 'Folder set. New thoughts will be saved as .md files'],
  'toast.reauthed': ['已重新授权', 'Access restored'],
  'toast.keySaved': ['密钥已保存', 'Key saved'],
  'toast.keyCleared': ['密钥已清除', 'Key cleared'],
  'toast.shareCopied': ['图片已下载，网址已复制，发给朋友吧～', 'Image downloaded and link copied. Go show your friends~'],
  'toast.shareUrl': ['图片已下载，网址：{url}', 'Image downloaded. Link: {url}'],
  // ---- 面板 ----
  'panel.list': ['想法列表', 'My notes'],
  'panel.ai': ['AI 整理', '🤖 AI sort-out'],
  'panel.settings': ['设置', 'Settings'],
  'list.search': ['搜索想法…', 'Search your thoughts…'],
  'list.allTags': ['全部标签', 'All tags'],
  'list.selAll': ['全选', 'Select all'],
  'list.selNone': ['全不选', 'Select none'],
  'list.export': ['导出全部 .md', 'Export all .md'],
  'list.noMatch': ['没有搜到～', 'Nothing matches~'],
  'list.empty': ['还没有想法，丢一条进桶试试 🗑️', 'No thoughts yet. Toss one into the bin 🗑️'],
  'list.toBanner': ['加到横幅', 'To ticker'],
  'list.toBanner.title': ['加到横幅', 'Add to the top ticker'],
  'list.del': ['删除', 'Delete'],
  'list.ask': ['确定删除这条吗？', 'Delete this one?'],
  'list.yes': ['删除', 'Delete'],
  'list.no': ['取消', 'Cancel'],
  'ai.count': ['将整理 <b>{n}</b> 条想法（{which}）。', 'Sorting out <b>{n}</b> thoughts ({which}).'],
  'ai.picked': ['已勾选的', 'the ones you ticked'],
  'ai.all': ['全部；可在「想法列表」里勾选', 'all of them; tick some in "My notes" to pick'],
  'ai.go': ['✨ 用 DeepSeek 整理', '✨ Sort out with DeepSeek'],
  'ai.copy': ['📋 一键复制整理提示词', '📋 Copy sort-out prompt'],
  'ai.mystic': ['🔮 复制玄学解读提示词', '🔮 Copy fortune-telling prompt'],
  'ai.noKeyHint': ['没有密钥？复制提示词后贴到豆包或 WorkBuddy 里用。', 'No key? Copy a prompt and paste it into ChatGPT, Doubao, WorkBuddy or any AI chat.'],
  'ai.thinking': ['思考中…', 'Thinking…'],
  'ai.resultTitle': ['AI 整理结果', 'AI sort-out result'],
  'ai.errNoKey': ['还没有填写 DeepSeek 密钥，请先到「设置」里填写，或使用「一键复制整理提示词」。', 'No DeepSeek key yet. Add one in Settings, or use "Copy sort-out prompt".'],
  'ai.errOffline': ['现在离线了，AI 整理需要联网。', 'You\'re offline. AI sort-out needs the internet.'],
  'ai.errHttp': ['DeepSeek 返回错误 {status}：{body}', 'DeepSeek returned error {status}: {body}'],
  'ai.empty': ['（AI 没有返回内容）', '(The AI returned nothing)'],
  'set.folder.h': ['📁 保存位置', '📁 Where it saves'],
  'set.folder.cur': ['当前文件夹：<b>{name}</b>', 'Current folder: <b>{name}</b>'],
  'set.folder.reauth': ['需要重新授权上次的文件夹', 'Your last folder needs permission again'],
  'set.folder.none': ['还没选文件夹，目前存在浏览器里', 'No folder picked. Thoughts live in your browser for now'],
  'set.folder.unsupported': ['当前浏览器不支持选择文件夹，想法存在浏览器里，可在列表中导出 .md。', 'This browser can\'t pick folders, so thoughts live in the browser. You can export .md from My notes.'],
  'set.folder.pick': ['选择文件夹', 'Pick a folder'],
  'set.folder.reauthBtn': ['重新授权', 'Grant access'],
  'set.banner.h': ['📢 我的横幅', '📢 My ticker lines'],
  'set.banner.ph': ['写一句你自己的吐槽…', 'Write your own one-liner…'],
  'set.banner.add': ['添加', 'Add'],
  'set.banner.remove': ['移除', 'Remove'],
  'set.banner.none': ['还没有自定义的句子，默认文案照常播放。', 'No custom lines yet. The default ones keep rolling.'],
  'set.keys.h': ['⌨️ 快捷键', '⌨️ Shortcuts'],
  'set.keys.p': ['N（不在输入时）或 Ctrl+Alt+N：新建对话框', 'N (when not typing) or Ctrl+Alt+N: new card'],
  'set.key.h': ['🔑 DeepSeek 密钥', '🔑 DeepSeek key'],
  'set.key.p': ['只保存在本浏览器（localStorage），不会上传到别处，仅在整理时发给 DeepSeek。', 'Stored only in this browser (localStorage). Never uploaded anywhere, only sent to DeepSeek when you sort them out.'],
  'set.key.save': ['保存密钥', 'Save key'],
  'set.key.clear': ['清除密钥', 'Clear key'],
  // ---- 引导 ----
  'tour.1': ['想到什么就写在这张卡片上，不用管格式。', 'Write anything on this card. No format needed.'],
  'tour.2': ['给它贴个标签：吐槽、灵感，还是心里话？', 'Tag it: rant, idea, or deep thoughts?'],
  'tour.3': ['把卡片拖进垃圾桶，它会吃掉并帮你保存。', 'Drag it into the bin. Nom. Saved.'],
  'tour.4': ['无聊的时候双击垃圾桶试试。', 'Bored? Double-click the bin. Trust me.'],
  'tour.5': ['写过的都在这里，还能生成本周回顾图片。', 'Everything you wrote lives here. You can also make a weekly recap image.'],
  'tour.6': ['攒了一堆乱想法？一键交给 AI，帮你理成要做的事。', 'Brain too messy? Let AI turn it into a to-do list.'],
  'tour.7': ['忘了怎么玩？随时点这里再看一遍。', 'Forgot how it works? Tap Help anytime.'],
  'tour.skip': ['跳过', 'Skip'],
  'tour.next': ['下一步', 'Next'],
  'tour.done': ['开始扔吧', 'Start tossing'],
  // ---- 使用须知 ----
  'help.title': ['使用须知', 'Help'],
  'help.sections': [[
    ['✍️ 写想法', ['点空白处 / <b>+</b> / <kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>：新建', '最多 <b>10</b> 个对话框；✕ 直接扔掉', '心情标签：😤 吐槽 · 💡 灵感 · 😢 心里话']],
    ['🗑️ 丢进桶', ['<b>拖进</b>垃圾桶，或<b>连点三下</b>对话框：保存', '空的不吃，会弹回来', '<b>双击</b>桶 / 2 秒<b>连点 5 下</b>：纸片爆出来', '没整理的多了桶会不开心；20 条打嗝，100 条喷纸']],
    ['📜 列表', ['搜索、按标签筛选、删除', '「加到横幅」·「导出全部 .md」']],
    ['🤖 AI整理', ['设置里填 DeepSeek 密钥后一键整理', '没密钥：一键复制整理提示词 → 豆包 / WorkBuddy']],
    ['📅 本周回顾', ['各标签统计，可下载 PNG 或「分享」；周五自动弹一次']],
    ['💾 导出备份', ['想法默认只存在浏览器里；点工具栏「导出备份」存成 .md']],
    ['⚙ 设置', ['选保存文件夹 · 我的横幅 · 密钥']],
    ['🌐 语言', ['自动跟随浏览器语言；右上角「中 / EN」随时切换']],
    ['⌨️ 快捷键', ['<kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> 新建 · <kbd>Esc</kbd> 关闭面板 / 本卡片']],
  ], [
    ['✍️ Write', ['Click empty space / <b>+</b> / <kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>: new card', 'Up to <b>10</b> cards; ✕ throws one away', 'Mood tags: 😤 Rant · 💡 Idea · 😢 Deep thoughts']],
    ['🗑️ Toss', ['<b>Drag</b> into the bin, or <b>triple-click</b> a card: saved', 'Empty cards get spat back out', '<b>Double-click</b> the bin / <b>click 5×</b> in 2s: paper explosion', 'Too many unsorted thoughts make the bin sad; burps at 20, sprays at 100']],
    ['📜 My notes', ['Search, filter by tag, delete', '"To ticker" · "Export all .md"']],
    ['🤖 AI sort-out', ['Add a DeepSeek key in Settings, then one click', 'No key: copy the prompt → any AI chat']],
    ['📅 Weekly recap', ['Counts per tag, download PNG or "Share"; pops up once every Friday']],
    ['💾 Back up', ['Thoughts live only in your browser by default; hit "Back up" to save a .md']],
    ['⚙ Settings', ['Save folder · My ticker lines · API key']],
    ['🌐 Language', ['Follows your browser language; flip with "中 / EN" up top anytime']],
    ['⌨️ Shortcuts', ['<kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> new card · <kbd>Esc</kbd> closes panels / this card']],
  ]],
  'help.tour': ['🧭 再看一遍新手引导', '🧭 Replay the tour'],
  'help.foot': ['除了 AI 整理，全部可离线使用<br>本站使用 Cloudflare Web Analytics，仅用于匿名访问统计，不上传任何想法内容。', 'Everything except AI sort-out works offline.<br>This site uses Cloudflare Web Analytics for anonymous visit counts only. Your thoughts are never uploaded.'],
  'help.contact': ['有想法、遇到问题？来 X 找我聊。', 'Ideas? Bugs? Find me on X.'],
  // ---- 备份提醒 ----
  'nudge.text': ['已有 <b>{n}</b> 条想法只存在浏览器里，清缓存就没了～', '<b>{n}</b> thoughts live only in this browser. Clear the cache and poof~'],
  'nudge.go': ['💾 导出备份', '💾 Back up'],
  'nudge.close': ['关闭', 'Close'],
  // ---- 本周回顾 ----
  'rv.title': ['🗑️ 本周思绪回顾', '🗑️ My Week in Thoughts'],
  'rv.total': ['本周一共丢进垃圾桶的想法（条）', 'thoughts tossed into the bin this week'],
  'rv.sign': ['—— 思绪垃圾桶', '— Thought Trash Bin'],
  'rv.comments': [['这周很安静，是不是太忙了？', '这周丢了几条，状态还行～', '这周脑子很活跃嘛！', '这周槽点满满，辛苦了，抱抱！'],
    ['Quiet week. Too busy to even rant?', 'A few tosses this week. Not bad~', 'Your brain was on fire this week!', 'So. Many. Rants. Hang in there, hugs!']],
  'rv.share': ['📤 分享', '📤 Share'],
  'rv.dl': ['⬇ 下载 PNG', '⬇ Download PNG'],
  'rv.close': ['关闭', 'Close'],
  'rv.file': ['本周回顾', 'weekly-recap'],
  'rv.shareTitle': ['本周思绪回顾', 'My Week in Thoughts'],
  'rv.shareText': ['这周我往思绪垃圾桶里丢了 {n} 条想法 {url}', 'I tossed {n} thoughts into the Thought Trash Bin this week {url}'],
  // ---- 彩蛋 / 咀嚼 ----
  'egg.empty': ['桶里空空的，先丢点想法进来吧～', 'The bin is empty. Feed it some thoughts first~'],
  'burp.bubble': ['嗝～', 'Burp~'],
  'burp.toast': ['嗝～桶里有 {n} 条以上没整理的想法了，去「AI整理」理一理吧！', 'Burp~ {n}+ unsorted thoughts in here. Time for an AI sort-out!'],
  // ---- 导出文件 ----
  'file.note': ['想法', 'thought'],
  'file.ai': ['AI整理', 'ai-sort-out'],
  'file.all': ['全部想法', 'all-thoughts'],
  'export.head': ['# 思绪垃圾桶 导出（共 {n} 条）', '# Thought Trash Bin export ({n} thoughts)'],
  // ---- 默认横幅（英文版是另写的办公室吐槽，不是直译） ----
  'banner.lines': [[
    '今天也是想辞职的一天', '老板又画饼了，我已经吃饱了', '周一综合征晚期，医生说没救了',
    '会议开了两小时，结论是再开一次会', '工资像大姨妈，一个月一次，一周就没了',
    '“这个需求很简单”——史上最可怕的七个字', '我不是在摸鱼，我是在思考人生',
    '打工人，打工魂，打工都是人上人（并不是）', '离下班还有 8 小时，离退休还有 30 年',
    '“辛苦了”不如“涨工资了”', '收到，好的，没问题，马上改——第 18 版', '我的工位就是我的牢房',
    '早上的我：今天要努力；下午的我：算了', '周报写得比我干的活还精彩', '领导说“随便聊聊”，我开始写遗书',
    '加班不可怕，可怕的是没有加班费', '我和闹钟之间，必须有一个先离职', '“你先做着，后面再说”，后面就没有后面了',
    '咖啡续命，奶茶回血，下班复活', '把烦恼丢进垃圾桶，明天又是一条好汉',
  ], [
    'Another day, another urge to quit', 'This meeting could have been an email', 'Per my last email… which you didn\'t read',
    'Two-hour meeting. Conclusion: another meeting', 'Payday: here on Friday, gone by Sunday',
    '"Quick question" — never quick, never one question', 'I\'m not slacking, I\'m strategically recharging',
    'Let\'s circle back… to never', '8 hours till home time, 30 years till retirement',
    '"Great job!" doesn\'t pay rent', 'Sure, no problem, on it — final_v18_REAL.pptx', 'My cubicle has better Wi-Fi than my career',
    'Morning me: let\'s crush it. 3pm me: let\'s not', 'My status report is more exciting than my actual work', '"Got a minute?" — said no one with good news',
    'Unpaid overtime: my favourite hobby (not)', 'Me vs. my alarm clock: one of us has to resign', '"Just start, we\'ll figure it out later" — later never came',
    'Running on coffee, rebooting at 6pm', 'Toss the stress in the bin. Tomorrow\'s a fresh start',
  ]],
};
const ls = typeof localStorage !== 'undefined' ? localStorage : null;
export function detect() {
  const saved = ls?.getItem(KEY); if (saved === 'zh' || saved === 'en') return saved;
  const langs = typeof navigator !== 'undefined' ? (navigator.languages?.length ? navigator.languages : [navigator.language || '']) : [];
  return langs.some(l => /^zh/i.test(l || '')) ? 'zh' : 'en';
}
export let LANG = detect();
export const isEn = () => LANG === 'en';
export function t(key, vars) {
  const e = D[key]; if (!e) { console.warn('i18n: missing key', key); return key; }
  const s = e[LANG === 'en' ? 1 : 0];
  return typeof s === 'string' && vars ? s.replace(/\{(\w+)\}/g, (_, n) => vars[n] ?? '') : s;
}
// 日期：中文「10月22日」，英文「Oct 22」
export const fmtMonthDay = d => LANG === 'en' ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `${d.getMonth() + 1}月${d.getDate()}日`;
// 把 index.html 里带 data-i18n* 的静态文字刷成当前语言
export function applyStatic(root = document) {
  document.documentElement.lang = LANG === 'en' ? 'en' : 'zh-CN';
  document.title = t('doc.title');
  document.querySelectorAll('meta[name=description], meta[property="og:description"], meta[name="twitter:description"]').forEach(m => m.content = t('meta.desc'));
  root.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  for (const [attr, name] of [['i18nTitle', 'title'], ['i18nAria', 'aria-label'], ['i18nPh', 'placeholder']])
    root.querySelectorAll(`[data-${attr.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}]`).forEach(el => el.setAttribute(name, t(el.dataset[attr])));
  document.querySelectorAll('.lang-toggle').forEach(b => { b.innerHTML = `<span class="${LANG === 'zh' ? 'cur' : ''}">中</span> / <span class="${LANG === 'en' ? 'cur' : ''}">EN</span>`; b.setAttribute('aria-label', t('lang.aria')); });
}
export function setLang(l) {
  if (l !== 'zh' && l !== 'en') return;
  LANG = l; ls?.setItem(KEY, l); applyStatic();
  dispatchEvent(new CustomEvent('ttb-lang', { detail: l }));
}
export const toggleLang = () => setLang(LANG === 'en' ? 'zh' : 'en');
