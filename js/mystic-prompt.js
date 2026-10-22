import { isEn } from './i18n.js';
// 玄学解读提示词：仅供娱乐，复用 ai.js 的笔记格式与复制逻辑
import { formatNotes } from './ai.js';

export function buildMysticPrompt(notes) {
  if (isEn()) return `[For entertainment only] Below are the work thoughts, rants and secrets I've tossed into my "Thought Trash Bin". Be a warm, funny "office mystic" and give me a light-hearted, playful reading based on them.

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
${formatNotes(notes)}`;
  return `【仅供娱乐】下面是我随手丢进「思绪垃圾桶」的上班想法、吐槽和心里话。请你当一位温暖又幽默的“职场玄学师”，根据这些内容给我来一份轻松好玩的玄学解读。

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
${formatNotes(notes)}`;
}
