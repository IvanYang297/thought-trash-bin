// 快捷键：Ctrl+Alt+N 随时新建；没在输入框里时按 N 也行
export function initShortcuts(newBubble) {
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey && e.altKey && k === 'n') || (k === 'n' && !typing && !e.ctrlKey && !e.altKey && !e.metaKey)) {
      e.preventDefault(); newBubble();
    }
  });
}
