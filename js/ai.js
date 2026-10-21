// AI 整理：DeepSeek 密钥只保存在本浏览器 localStorage，代码里不含任何密钥
import { fmtFull } from './storage.js';
const KEY = 'ttb.deepseekKey';
export const getKey = () => localStorage.getItem(KEY) || '';
export const setKey = k => k ? localStorage.setItem(KEY, k.trim()) : localStorage.removeItem(KEY);

export const formatNotes = notes => notes.map((n, i) => `${i + 1}. [${fmtFull(n.createdAt)}] ${n.text}`).join('\n');

export function buildPrompt(notes) {
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
  if (!key) throw new Error('还没有填写 DeepSeek 密钥，请先到「设置」里填写，或使用「一键复制整理提示词」。');
  if (!navigator.onLine) throw new Error('现在离线了，AI 整理需要联网。');
  const r = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: buildPrompt(notes) }], temperature: 0.7 }),
  });
  if (!r.ok) throw new Error(`DeepSeek 返回错误 ${r.status}：${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  return j.choices?.[0]?.message?.content || '（AI 没有返回内容）';
}
export const copyPrompt = notes => copyText(buildPrompt(notes));
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
}
