// 彩蛋：纸片从垃圾桶里爆出来，写着时间和当时的想法
import { fmtShort } from './storage.js';
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export function explode(notes, origin) {
  document.querySelectorAll('.scrap').forEach(s => s.remove());
  const list = notes.length ? notes.slice(0, 24) : [{ createdAt: Date.now(), text: '桶里空空的，先丢点想法进来吧～' }];
  list.forEach((n, i) => {
    const s = document.createElement('div');
    s.className = 'scrap';
    s.innerHTML = `<time>${fmtShort(n.createdAt)}</time>${esc(n.text.length > 80 ? n.text.slice(0, 80) + '…' : n.text)}`;
    s.style.left = origin.x - 90 + 'px'; s.style.top = origin.y + 'px';
    s.style.transform = 'scale(.2)'; s.style.opacity = '0';
    document.body.appendChild(s);
    const ang = (-160 + Math.random() * 140) * Math.PI / 180, dist = 180 + Math.random() * Math.min(innerWidth, innerHeight) * 0.45;
    requestAnimationFrame(() => setTimeout(() => {
      s.style.opacity = '1';
      s.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) rotate(${-25 + Math.random() * 50}deg)`;
    }, i * 40));
    s.addEventListener('click', () => s.remove());
    setTimeout(() => { s.style.opacity = '0'; setTimeout(() => s.remove(), 700); }, 7000 + i * 60);
  });
}
