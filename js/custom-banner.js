// 自定义横幅：用户自己加的句子存在 localStorage，和默认文案混在一起播放
const KEY = 'ttb.customBanner';
export const getCustom = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = a => localStorage.setItem(KEY, JSON.stringify(a));
export function addCustom(line) {
  line = line.trim().replace(/\s+/g, ' ').slice(0, 60); if (!line) return false;
  const a = getCustom(); if (a.includes(line)) return false; a.push(line); save(a); return true;
}
export function removeCustom(line) { save(getCustom().filter(l => l !== line)); }
