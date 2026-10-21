// 皱巴巴的纸团：不规则多边形 + 阴影 + 折痕（确定性随机，同一个 seed 长一样）
function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
export function paperBall(r, seed = 1) {
  const R = rng(seed), n = 11, pts = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + R() * 0.3, d = r * (0.78 + R() * 0.27); pts.push([Math.cos(a) * d, Math.sin(a) * d]); }
  const P = pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  // 阴影：右下半边
  const shade = [[0, 0], ...pts.slice(1, 6)].map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  const creases = Array.from({ length: 4 }, () => {
    const a = pts[Math.floor(R() * n)], b = pts[Math.floor(R() * n)], mx = (R() - .5) * r * .5, my = (R() - .5) * r * .5;
    return `M${(a[0] * .7).toFixed(1)} ${(a[1] * .7).toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)} L${(b[0] * .6).toFixed(1)} ${(b[1] * .6).toFixed(1)}`;
  }).join(' ');
  return `<g class="paper" transform="rotate(${Math.floor(R() * 360)})">
    <polygon points="${P}" fill="#f6f1e3" stroke="#8f7a55" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="${shade}" fill="#d9cfb6" opacity=".75"/>
    <path d="${creases}" fill="none" stroke="#a8946e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}
