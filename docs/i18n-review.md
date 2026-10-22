# 中英文案对照表（v1.2）

来源：`js/i18n.js`（改文案请直接改那个文件，这张表由脚本生成，仅供校对）。`{n}` 这类是变量，别删。

另：两段 AI 提示词（整理 / 玄学）较长，直接写在 `js/ai.js` 和 `js/mystic-prompt.js` 里，中英各一段，见文末。

| key | 中文 | English |
|---|---|---|
| `doc.title` | 思绪垃圾桶 · 烦心事、灵感、心里话，写下来，扔进桶里 | Thought Trash Bin · Rants, ideas, 3am thoughts. Write it, toss it. |
| `meta.desc` | 一个会“吃”想法的垃圾桶：随手写、拖进去、每周看回顾，还能交给 AI 帮你理清。免费，不用注册。 | A trash bin that eats your thoughts: scribble, drag it in, get a weekly recap, and let AI sort the mess. Free, no sign-up. |
| `lang.aria` | 切换语言 / Switch language | Switch language / 切换语言 |
| `lang.switched` | 已切换到中文 | Switched to English |
| `banner.aria` | 吐槽横幅 | Rant ticker |
| `tb.list` | 📜 想法列表 | 📜 My notes |
| `tb.review` | 📅 本周回顾 | 📅 Weekly recap |
| `tb.review.title` | 本周回顾卡片（每周五自动弹出） | Weekly recap card (pops up every Friday) |
| `tb.ai` | 🤖 AI整理 | 🤖 AI tidy-up |
| `tb.backup` | 💾 导出备份 | 💾 Back up |
| `tb.backup.title` | 把全部想法导出成一个 .md 文件，换浏览器或清缓存也不怕丢 | Export everything as one .md file, so switching browsers or clearing cache won't eat it |
| `tb.settings` | ⚙ 设置 | ⚙ Settings |
| `tb.help` | ❓ 使用须知 | ❓ Help |
| `tb.help.aria` | 使用须知：所有操作和快捷键 | Help: every trick and shortcut |
| `hero.aria` | 简介 | About |
| `hero.brand` | 🗑️ 思绪垃圾桶 | 🗑️ Thought Trash Bin |
| `hero.headline` | 烦心事、灵感、心里话，写下来，扔进桶里。 | Rants, ideas, 3am thoughts. Write it, toss it, feel lighter. |
| `hero.sub` | 拖进垃圾桶就保存，双击桶有惊喜。数据只存在你自己的浏览器里。 | Drop it in the bin to save. Double-click the bin for a surprise. Your stuff never leaves your browser. |
| `stage.title` | 点空白处写一条新想法 | Click any empty spot to write a new thought |
| `add.title` | 新建对话框（快捷键 N 或 Ctrl+Alt+N） | New card (shortcut: N or Ctrl+Alt+N) |
| `trash.title` | 把对话框拖进来；双击或狂点有惊喜 | Drag cards in here. Double-click or spam-click for a surprise |
| `counter.pre` | 已吃掉 | Ate |
| `counter.post` | 条 | thoughts |
| `panel.close` | 关闭 | Close |
| `author.x` | 来 X 找我聊 | Chat with me on X |
| `author.gh` | 看看源码 | View on GitHub |
| `land.title` | 思绪垃圾桶 | Thought Trash Bin |
| `land.intro` | 烦心事、灵感、心里话，写下来，扔进桶里。 | Rants, ideas, 3am thoughts. Write it, toss it, feel lighter. |
| `land.enter` | 进入垃圾桶 → | Open the bin → |
| `land.small` | 免费，不用注册，内容只存在你自己的浏览器里。 | Free, no sign-up. Everything stays in your own browser. |
| `land.what.h` | 这是什么 | What is this? |
| `land.what.p` | 一个会“吃”想法的网页垃圾桶：把脑子里乱糟糟的念头写在卡片上，拖进桶里就自动保存。之后可以搜索、导出、每周生成一张回顾图，也能一键交给 DeepSeek 等 AI 帮你理成要做的事。 | A web trash bin that eats your thoughts. Dump whatever's rattling around your head onto a card, drag it into the bin, and it's saved. Later you can search it, export it, make a weekly recap image, or hand the whole pile to an AI like DeepSeek to turn it into a to-do list. |
| `land.who.h` | 适合谁 | Who is it for? |
| `land.who.p` | 上班时脑子停不下来的打工人、想随手记灵感又懒得开笔记软件的人、需要找个地方吐槽和说心里话的人。 | Office workers whose brains won't shut up during work, people who want to catch ideas without opening a "real" notes app, and anyone who just needs somewhere to vent. |
| `land.skip` | 跳过 | Skip |
| `bubble.grip` | ⠿ 拖我进垃圾桶 | ⠿ Drag me to the bin |
| `bubble.close` | 不要了 | Nah, toss it |
| `bubble.hints` | 1. 想到啥写啥…<br>2. 吐个槽吧…<br>3. 心里话放这里…<br>4. 老板今天又说啥了？<br>5. 脑子里乱糟糟的，倒出来吧…<br>6. 一个突发奇想…<br>7. 今天最想吐槽的一件事…<br>8. 偷偷写，桶不会说出去的～ | 1. Type whatever…<br>2. Go on, vent…<br>3. Secrets go here…<br>4. What did the boss say this time?<br>5. Brain full? Pour it out…<br>6. A random shower thought…<br>7. The #1 thing that annoyed you today…<br>8. Psst, the bin won't tell anyone~ |
| `tag.rant` | 吐槽 | Rant |
| `tag.idea` | 灵感 | Idea |
| `tag.heart` | 心里话 | Secret |
| `tag.none` | 无标签 | No tag |
| `tag.picked` | 已选：{name} | Tagged: {name} |
| `tag.cleared` | 已取消 | Tag removed |
| `toast.limit` | 最多 10 个对话框，先丢几个进桶吧～ | Max 10 cards. Toss a few into the bin first~ |
| `toast.empty` | 空的对话框，桶不吃哦～先写点什么吧 | Empty card? The bin's not eating that. Write something first~ |
| `toast.savedFolder` | 嚼嚼嚼…已存进文件夹 📁 | Nom nom nom… saved to your folder 📁 |
| `toast.savedBrowser` | 嚼嚼嚼…已存在浏览器里 | Nom nom nom… saved in your browser |
| `toast.saveFail` | 保存失败：{msg} | Couldn't save: {msg} |
| `toast.bannerAdded` | 已加到横幅 ✍️ | Added to the ticker ✍️ |
| `toast.bannerDup` | 这句已经在横幅里了（或为空） | That line's already on the ticker (or it's empty) |
| `toast.bannerRemoved` | 已从横幅移除 | Removed from the ticker |
| `toast.backupDone` | 已导出全部想法（.md），存好这个文件就不怕丢 | Exported everything (.md). Keep that file safe and nothing's lost |
| `toast.promptCopied` | 提示词已复制，去粘贴吧～ | Prompt copied. Go paste it~ |
| `toast.noNotes` | 还没有想法可以整理 | Nothing to tidy up yet |
| `toast.savedTo` | 已保存到文件夹：{name} | Saved to folder: {name} |
| `toast.downloaded` | 已下载：{name} | Downloaded: {name} |
| `toast.folderPicked` | 文件夹已选好，之后的想法会存成 .md | Folder set. New thoughts will be saved as .md files |
| `toast.reauthed` | 已重新授权 | Access restored |
| `toast.keySaved` | 密钥已保存 | Key saved |
| `toast.keyCleared` | 密钥已清除 | Key cleared |
| `toast.shareCopied` | 图片已下载，网址已复制，发给朋友吧～ | Image downloaded and link copied. Go show your friends~ |
| `toast.shareUrl` | 图片已下载，网址：{url} | Image downloaded. Link: {url} |
| `panel.list` | 想法列表 | My notes |
| `panel.ai` | AI 整理 | AI tidy-up |
| `panel.settings` | 设置 | Settings |
| `list.search` | 搜索想法… | Search your thoughts… |
| `list.allTags` | 全部标签 | All tags |
| `list.selAll` | 全选 | Select all |
| `list.selNone` | 全不选 | Select none |
| `list.export` | 导出全部 .md | Export all .md |
| `list.noMatch` | 没有搜到～ | Nothing matches~ |
| `list.empty` | 还没有想法，丢一条进桶试试 🗑️ | No thoughts yet. Toss one into the bin 🗑️ |
| `list.toBanner` | 加到横幅 | To ticker |
| `list.toBanner.title` | 加到横幅 | Add to the top ticker |
| `list.del` | 删除 | Delete |
| `list.ask` | 确定删除这条吗？ | Delete this one? |
| `list.yes` | 删除 | Delete |
| `list.no` | 取消 | Cancel |
| `ai.count` | 将整理 <b>{n}</b> 条想法（{which}）。 | Tidying up <b>{n}</b> thoughts ({which}). |
| `ai.picked` | 已勾选的 | the ones you ticked |
| `ai.all` | 全部；可在「想法列表」里勾选 | all of them; tick some in "My notes" to pick |
| `ai.go` | ✨ 用 DeepSeek 整理 | ✨ Tidy up with DeepSeek |
| `ai.copy` | 📋 一键复制整理提示词 | 📋 Copy tidy-up prompt |
| `ai.mystic` | 🔮 复制玄学解读提示词 | 🔮 Copy fortune-telling prompt |
| `ai.noKeyHint` | 没有密钥？复制提示词后贴到豆包或 WorkBuddy 里用。 | No key? Copy a prompt and paste it into ChatGPT, Doubao, WorkBuddy or any AI chat. |
| `ai.thinking` | 思考中… | Thinking… |
| `ai.resultTitle` | AI 整理结果 | AI tidy-up result |
| `ai.errNoKey` | 还没有填写 DeepSeek 密钥，请先到「设置」里填写，或使用「一键复制整理提示词」。 | No DeepSeek key yet. Add one in Settings, or use "Copy tidy-up prompt". |
| `ai.errOffline` | 现在离线了，AI 整理需要联网。 | You're offline. AI tidy-up needs the internet. |
| `ai.errHttp` | DeepSeek 返回错误 {status}：{body} | DeepSeek returned error {status}: {body} |
| `ai.empty` | （AI 没有返回内容） | (The AI returned nothing) |
| `set.folder.h` | 📁 保存位置 | 📁 Where it saves |
| `set.folder.cur` | 当前文件夹：<b>{name}</b> | Current folder: <b>{name}</b> |
| `set.folder.reauth` | 需要重新授权上次的文件夹 | Your last folder needs permission again |
| `set.folder.none` | 还没选文件夹，目前存在浏览器里 | No folder picked. Thoughts live in your browser for now |
| `set.folder.unsupported` | 当前浏览器不支持选择文件夹，想法存在浏览器里，可在列表中导出 .md。 | This browser can't pick folders, so thoughts live in the browser. You can export .md from My notes. |
| `set.folder.pick` | 选择文件夹 | Pick a folder |
| `set.folder.reauthBtn` | 重新授权 | Grant access |
| `set.banner.h` | 📢 我的横幅 | 📢 My ticker lines |
| `set.banner.ph` | 写一句你自己的吐槽… | Write your own one-liner… |
| `set.banner.add` | 添加 | Add |
| `set.banner.remove` | 移除 | Remove |
| `set.banner.none` | 还没有自定义的句子，默认文案照常播放。 | No custom lines yet. The default ones keep rolling. |
| `set.keys.h` | ⌨️ 快捷键 | ⌨️ Shortcuts |
| `set.keys.p` | N（不在输入时）或 Ctrl+Alt+N：新建对话框 | N (when not typing) or Ctrl+Alt+N: new card |
| `set.key.h` | 🔑 DeepSeek 密钥 | 🔑 DeepSeek key |
| `set.key.p` | 只保存在本浏览器（localStorage），不会上传到别处，仅在整理时发给 DeepSeek。 | Stored only in this browser (localStorage). Never uploaded anywhere, only sent to DeepSeek when you tidy up. |
| `set.key.save` | 保存密钥 | Save key |
| `set.key.clear` | 清除密钥 | Clear key |
| `tour.1` | 想到什么就写在这张卡片上，不用管格式。 | Write anything on this card. No format needed. |
| `tour.2` | 给它贴个标签：吐槽、灵感，还是心里话？ | Tag it: rant, idea, or secret? |
| `tour.3` | 把卡片拖进垃圾桶，它会吃掉并帮你保存。 | Drag it into the bin. Nom. Saved. |
| `tour.4` | 无聊的时候双击垃圾桶试试。 | Bored? Double-click the bin. Trust me. |
| `tour.5` | 写过的都在这里，还能生成本周回顾图片。 | Everything you wrote lives here. You can also make a weekly recap image. |
| `tour.6` | 攒了一堆乱想法？一键交给 AI，帮你理成要做的事。 | Brain too messy? Let AI turn it into a to-do list. |
| `tour.7` | 忘了怎么玩？随时点这里再看一遍。 | Forgot how it works? Tap Help anytime. |
| `tour.skip` | 跳过 | Skip |
| `tour.next` | 下一步 | Next |
| `tour.done` | 开始扔吧 | Start tossing |
| `help.title` | 使用须知 | Help |
| `help.sections` | **✍️ 写想法** 点空白处 / <b>+</b> / <kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>：新建 / 最多 <b>10</b> 个对话框；✕ 直接扔掉 / 心情标签：😤 吐槽 · 💡 灵感 · 😢 心里话<br>**🗑️ 丢进桶** <b>拖进</b>垃圾桶，或<b>连点三下</b>对话框：保存 / 空的不吃，会弹回来 / <b>双击</b>桶 / 2 秒<b>连点 5 下</b>：纸片爆出来 / 没整理的多了桶会不开心；20 条打嗝，100 条喷纸<br>**📜 列表** 搜索、按标签筛选、删除 / 「加到横幅」·「导出全部 .md」<br>**🤖 AI整理** 设置里填 DeepSeek 密钥后一键整理 / 没密钥：一键复制整理提示词 → 豆包 / WorkBuddy<br>**📅 本周回顾** 各标签统计，可下载 PNG 或「分享」；周五自动弹一次<br>**💾 导出备份** 想法默认只存在浏览器里；点工具栏「导出备份」存成 .md<br>**⚙ 设置** 选保存文件夹 · 我的横幅 · 密钥<br>**🌐 语言** 自动跟随浏览器语言；右上角「中 / EN」随时切换<br>**⌨️ 快捷键** <kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> 新建 · <kbd>Esc</kbd> 关闭面板 / 本卡片 | **✍️ Write** Click empty space / <b>+</b> / <kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>: new card / Up to <b>10</b> cards; ✕ throws one away / Mood tags: 😤 Rant · 💡 Idea · 😢 Secret<br>**🗑️ Toss** <b>Drag</b> into the bin, or <b>triple-click</b> a card: saved / Empty cards get spat back out / <b>Double-click</b> the bin / <b>click 5×</b> in 2s: paper explosion / Too many untidied thoughts make the bin sad; burps at 20, sprays at 100<br>**📜 My notes** Search, filter by tag, delete / "To ticker" · "Export all .md"<br>**🤖 AI tidy-up** Add a DeepSeek key in Settings, then one click / No key: copy the prompt → any AI chat<br>**📅 Weekly recap** Counts per tag, download PNG or "Share"; pops up once every Friday<br>**💾 Back up** Thoughts live only in your browser by default; hit "Back up" to save a .md<br>**⚙ Settings** Save folder · My ticker lines · API key<br>**🌐 Language** Follows your browser language; flip with "中 / EN" up top anytime<br>**⌨️ Shortcuts** <kbd>N</kbd> / <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> new card · <kbd>Esc</kbd> closes panels / this card |
| `help.tour` | 🧭 再看一遍新手引导 | 🧭 Replay the tour |
| `help.foot` | 除了 AI 整理，全部可离线使用<br>本站使用 Cloudflare Web Analytics，仅用于匿名访问统计，不上传任何想法内容。 | Everything except AI tidy-up works offline.<br>This site uses Cloudflare Web Analytics for anonymous visit counts only. Your thoughts are never uploaded. |
| `help.contact` | 有想法、遇到问题？来 X 找我聊。 | Got ideas or hit a bug? Come chat on X. |
| `nudge.text` | 已有 <b>{n}</b> 条想法只存在浏览器里，清缓存就没了～ | <b>{n}</b> thoughts live only in this browser. Clear the cache and poof~ |
| `nudge.go` | 💾 导出备份 | 💾 Back up |
| `nudge.close` | 关闭 | Close |
| `rv.title` | 🗑️ 本周思绪回顾 | 🗑️ My Week in Thoughts |
| `rv.total` | 本周一共丢进垃圾桶的想法（条） | thoughts tossed into the bin this week |
| `rv.sign` | —— 思绪垃圾桶 | — Thought Trash Bin |
| `rv.comments` | 1. 这周很安静，是不是太忙了？<br>2. 这周丢了几条，状态还行～<br>3. 这周脑子很活跃嘛！<br>4. 这周槽点满满，辛苦了，抱抱！ | 1. Quiet week. Too busy to even rant?<br>2. A few tosses this week. Not bad~<br>3. Your brain was on fire this week!<br>4. So. Many. Rants. Hang in there, hugs! |
| `rv.share` | 📤 分享 | 📤 Share |
| `rv.dl` | ⬇ 下载 PNG | ⬇ Download PNG |
| `rv.close` | 关闭 | Close |
| `rv.file` | 本周回顾 | weekly-recap |
| `rv.shareTitle` | 本周思绪回顾 | My Week in Thoughts |
| `rv.shareText` | 这周我往思绪垃圾桶里丢了 {n} 条想法 {url} | I tossed {n} thoughts into the Thought Trash Bin this week {url} |
| `egg.empty` | 桶里空空的，先丢点想法进来吧～ | The bin is empty. Feed it some thoughts first~ |
| `burp.bubble` | 嗝～ | Burp~ |
| `burp.toast` | 嗝～桶里有 {n} 条以上没整理的想法了，去「AI整理」理一理吧！ | Burp~ {n}+ untidied thoughts in here. Time for an AI tidy-up! |
| `file.note` | 想法 | thought |
| `file.ai` | AI整理 | ai-tidy-up |
| `file.all` | 全部想法 | all-thoughts |
| `export.head` | # 思绪垃圾桶 导出（共 {n} 条） | # Thought Trash Bin export ({n} thoughts) |
| `banner.lines` | 1. 今天也是想辞职的一天<br>2. 老板又画饼了，我已经吃饱了<br>3. 周一综合征晚期，医生说没救了<br>4. 会议开了两小时，结论是再开一次会<br>5. 工资像大姨妈，一个月一次，一周就没了<br>6. “这个需求很简单”——史上最可怕的七个字<br>7. 我不是在摸鱼，我是在思考人生<br>8. 打工人，打工魂，打工都是人上人（并不是）<br>9. 离下班还有 8 小时，离退休还有 30 年<br>10. “辛苦了”不如“涨工资了”<br>11. 收到，好的，没问题，马上改——第 18 版<br>12. 我的工位就是我的牢房<br>13. 早上的我：今天要努力；下午的我：算了<br>14. 周报写得比我干的活还精彩<br>15. 领导说“随便聊聊”，我开始写遗书<br>16. 加班不可怕，可怕的是没有加班费<br>17. 我和闹钟之间，必须有一个先离职<br>18. “你先做着，后面再说”，后面就没有后面了<br>19. 咖啡续命，奶茶回血，下班复活<br>20. 把烦恼丢进垃圾桶，明天又是一条好汉 | 1. Another day, another urge to quit<br>2. This meeting could have been an email<br>3. Per my last email… which you didn't read<br>4. Two-hour meeting. Conclusion: another meeting<br>5. Payday: here on Friday, gone by Sunday<br>6. "Quick question" — never quick, never one question<br>7. I'm not slacking, I'm strategically recharging<br>8. Let's circle back… to never<br>9. 8 hours till home time, 30 years till retirement<br>10. "Great job!" doesn't pay rent<br>11. Sure, no problem, on it — final_v18_REAL.pptx<br>12. My cubicle has better Wi-Fi than my career<br>13. Morning me: let's crush it. 3pm me: let's not<br>14. My status report is more exciting than my actual work<br>15. "Got a minute?" — said no one with good news<br>16. Unpaid overtime: my favourite hobby (not)<br>17. Me vs. my alarm clock: one of us has to resign<br>18. "Just start, we'll figure it out later" — later never came<br>19. Running on coffee, rebooting at 6pm<br>20. Toss the stress in the bin. Tomorrow's a fresh start |

## 整理提示词 / Tidy-up prompt

**中文**

```text
你是一位温柔又靠谱的个人效率教练。下面是我随手丢进「思绪垃圾桶」的零散想法、吐槽和心里话，内容可能很乱、很情绪化。
请帮我整理成可执行的计划，要求：
1. 先用一两句话共情一下我的情绪（别说教）。
2. 把相关想法归并成若干「项目」，每个项目起一个简短名字。
3. 每个项目列出具体「步骤」（动词开头，尽量小到今天就能开始）。
4. 给每个项目标注「优先级」（高/中/低），并说明一句理由。
5. 纯吐槽、无需行动的内容，单独放在「放下吧」一节，不必硬拆成任务。
6. 用 Markdown 输出，标题清晰，不要编造我没提到的事实。

我的想法如下：
（想法列表）
```

**English**

```text
You're a warm, no-nonsense personal productivity coach. Below are random thoughts, rants and secrets I've tossed into my "Thought Trash Bin". They may be messy and emotional.
Please turn them into an actionable plan:
1. Start with a sentence or two acknowledging how I feel (no lecturing).
2. Group related thoughts into a few "Projects", each with a short name.
3. For each project, list concrete "Steps" (start with a verb, small enough to begin today).
4. Give each project a "Priority" (High / Medium / Low) with a one-line reason.
5. Pure venting that needs no action goes in a separate "Let it go" section. Don't force it into tasks.
6. Output in Markdown with clear headings. Don't invent facts I didn't mention.

My thoughts:
(notes list)
```

## 玄学解读提示词 / Fortune prompt

**中文**

```text
【仅供娱乐】下面是我随手丢进「思绪垃圾桶」的上班想法、吐槽和心里话。请你当一位温暖又幽默的“职场玄学师”，根据这些内容给我来一份轻松好玩的玄学解读。

解读风格可以从「塔罗」「星座运势」「MBTI」「今日宜忌」里任选一种（不确定就用「今日宜忌 + 塔罗口吻」）。

请严格按下面的卡片格式输出：
【今日签文】一句短短的签文
宜：……（例如：宜摸鱼）
忌：……（例如：忌改PPT）
幸运色：……
解读：用你选的那一种风格，写三四句简短的解读，并注明用的是哪种风格

然后另起一节「3 条现实小建议」：根据我写的内容，给出 3 条今天就能做到的具体小建议。

要求：
1. 语气温暖、幽默、积极，不制造焦虑，不说吓人的话。
2. 不做任何健康、医疗、财运、投资或理财方面的预测和建议。
3. 不要编造我没提到的事实。
4. 结尾再写一句：「以上仅供娱乐，开心最重要～」

我的想法如下：
（想法列表）
```

**English**

```text
[For entertainment only] Below are the work thoughts, rants and secrets I've tossed into my "Thought Trash Bin". Be a warm, funny "office mystic" and give me a light-hearted, playful reading based on them.

Pick one style: Tarot, horoscope, MBTI, or "Today's Do & Avoid" (if unsure, use "Today's Do & Avoid" in a tarot-reader voice).

Use exactly this card format:
Today's Fortune: one short fortune line
Do: … (e.g. Do: take a long coffee break)
Avoid: … (e.g. Avoid: editing slides)
Lucky color: …
Reading: three or four short sentences in the style you picked, and say which style you used

Then add a separate section "3 practical tips": based on what I wrote, give 3 concrete small things I can actually do today.

Rules:
1. Keep it warm, funny and positive. No fear-mongering, nothing scary.
2. No predictions or advice about health, medical issues, money luck, investing or finance.
3. Don't invent facts I didn't mention.
4. End with this line: "All of this is for entertainment only. Have fun!"

My thoughts:
(notes list)
```
