"""冒烟测试：python3 tests/smoke_test.py（需 pip install playwright && playwright install chromium）"""
import http.server, threading, functools, os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
errors = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 800})
    pg.on('console', lambda m: m.type == 'error' and errors.append(m.text))
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('http://127.0.0.1:8765/index.html'); pg.wait_for_selector('.bubble')
    def drop(text):
        bub = pg.locator('.bubble').first
        bub.locator('textarea').fill(text)
        g = bub.locator('.grip').bounding_box(); t = pg.locator('#trash').bounding_box()
        pg.mouse.move(g['x'] + 20, g['y'] + 7); pg.mouse.down()
        pg.mouse.move(t['x'] + t['width'] / 2, t['y'] + t['height'] / 2, steps=15); pg.mouse.up()
        pg.wait_for_timeout(400)
    # 空对话框：显示提示语、value 为空、拖进桶不保存并弹回
    ph = pg.locator('.bubble textarea').first.get_attribute('placeholder')
    assert ph and pg.locator('.bubble textarea').first.input_value() == ''
    drop(''); pg.wait_for_timeout(400)
    assert pg.text_content('#count') == '0' and pg.locator('.bubble').count() == 2
    bb = pg.locator('.bubble').first.bounding_box(); t0 = pg.locator('#trash').bounding_box()
    assert bb['y'] + bb['height'] < t0['y'], '空对话框应弹回'
    print('空对话框提示语/不保存/弹回 OK:', ph)
    assert pg.get_attribute('#btn-add', 'title').startswith('新建对话框')
    drop('老板又让我周末改方案，烦死了'); drop('想学做咖啡，下个月报个班')
    assert pg.text_content('#count') == '2', pg.text_content('#count')
    n = pg.evaluate("""() => new Promise(r => { const q = indexedDB.open('thought-trash-bin'); q.onsuccess = () => {
        const g = q.result.transaction('notes').objectStore('notes').getAll(); g.onsuccess = () => r(g.result); }; })""")
    assert len(n) == 2 and all(x['text'] not in ('', ph) for x in n) and any('咖啡' in x['text'] for x in n), n
    print('IndexedDB 保存 OK:', [x['text'] for x in n])
    for _ in range(5): pg.click('#trash', delay=10)
    pg.wait_for_timeout(1300)
    scraps = pg.locator('.scrap'); assert scraps.count() == 2, scraps.count()
    print('爆炸纸片 OK:', scraps.all_inner_texts())
    pg.locator('.scrap').evaluate_all('s => s.forEach(x => x.remove())')
    pg.dblclick('#trash'); pg.wait_for_timeout(1300)
    assert pg.locator('.scrap').count() == 2; print('双击爆炸 OK')
    pg.click('#btn-list'); pg.fill('#search', '咖啡'); assert pg.locator('.note-item').count() == 1; print('搜索 OK')
    # 默认状态截图：全新上下文（无存储），所有对话框为空、只显示淡色提示语
    ctx = b.new_context(viewport={'width': 1280, 'height': 800}); fp = ctx.new_page()
    fp.on('pageerror', lambda e: errors.append(str(e)))
    fp.goto('http://127.0.0.1:8765/index.html'); fp.wait_for_selector('.bubble')
    vals = fp.locator('.bubble textarea').evaluate_all('ts => ts.map(t => [t.value, t.placeholder])')
    assert vals and all(v == '' and ph for v, ph in vals), vals
    fp.evaluate('document.activeElement.blur()'); fp.wait_for_timeout(500)
    fp.screenshot(path=os.path.join(ROOT, 'docs', 'screenshot.png'))
    print('默认状态全为空提示语 OK:', [ph for _, ph in vals])
    b.close()
srv.shutdown()
assert not errors, errors
print('控制台无报错，全部通过')
