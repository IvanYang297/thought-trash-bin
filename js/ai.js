import { t, isEn, LANG } from './i18n.js';
// AI 整理：DeepSeek 密钥只保存在本浏览器 localStorage，代码里不含任何密钥
import { fmtFull } from './storage.js';
const KEY = 'ttb.deepseekKey';
export const getKey = () => localStorage.getItem(KEY) || '';
export const setKey = k => k ? localStorage.setItem(KEY, k.trim()) : localStorage.removeItem(KEY);

export const formatNotes = notes => notes.map((n, i) => `${i + 1}. [${fmtFull(n.createdAt)}] ${n.text}`).join('\n');

export function buildPrompt(notes) {
  if (isEn()) return `You're a warm, no-nonsense personal productivity coach. Below are random thoughts, rants and secrets I've tossed into my "Thought Trash Bin". They may be messy and emotional.
Please turn them into an actionable plan:
1. Start with a sentence or two acknowledging how I feel (no lecturing).
2. Group related thoughts into a few "Projects", each with a short name.
3. For each project, list concrete "Steps" (start with a verb, small enough to begin today).
4. Give each project a "Priority" (High / Medium / Low) with a one-line reason.
5. Pure venting that needs no action goes in a separate "Let it go" section. Don't force it into tasks.
6. Output in Markdown with clear headings. Don't invent facts I didn't mention.

My thoughts:
${formatNotes(notes)}`;
  return `你是一位温柔又靠谱的个人效率教练。下面是我随手丢进「思绪垃圾桶」的零散想法、吐槽和心里话，内容可能很乱、很情绪化。
请帮我整理成可执行的计划，要求：
1. 先用一两句话共情一下我的情绪（别说教）。
2. 把相关想法归并成若干「项目」，每个项目起一个简短名字。
3. 每个项目列出具体「步骤」（动词开头，尽量小到今天就能开始）。
4. 给每个项目标注「优先级」（高/中/低），并说明一句理由。
5. 纯吐槽、无需行动的内容，单独放在「放下吧」一节，不必硬拆成任务。
6. 用 Markdown 输出，标题清晰，不要编造我没提到的事实。

我的想法如下：
${formatNotes(notes)}`;
}

export async function organize(notes) {
  const key = getKey();
  if (!key) throw new Error(t('ai.errNoKey'));
  if (!navigator.onLine) throw new Error(t('ai.errOffline'));
  const r = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: buildPrompt(notes) }], temperature: 0.7 }),
  });
  if (!r.ok) throw new Error(t('ai.errHttp', { status: r.status, body: (await r.text()).slice(0, 200) }));
  const j = await r.json();
  return j.choices?.[0]?.message?.content || t('ai.empty');
}
export const copyPrompt = notes => copyText(buildPrompt(notes));
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
}
