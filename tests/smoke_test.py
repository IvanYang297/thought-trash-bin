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
    drop('老板又让我周末改方案，烦死了'); drop('想学做咖啡，下个月报个班')
    assert pg.text_content('#count') == '2', pg.text_content('#count')
    n = pg.evaluate("""() => new Promise(r => { const q = indexedDB.open('thought-trash-bin'); q.onsuccess = () => {
        const g = q.result.transaction('notes').objectStore('notes').getAll(); g.onsuccess = () => r(g.result); }; })""")
    assert len(n) == 2 and any('咖啡' in x['text'] for x in n), n
    print('IndexedDB 保存 OK:', [x['text'] for x in n])
    for _ in range(5): pg.click('#trash', delay=10)
    pg.wait_for_timeout(1300)
    scraps = pg.locator('.scrap'); assert scraps.count() == 2, scraps.count()
    print('爆炸纸片 OK:', scraps.all_inner_texts())
    pg.locator('.scrap').evaluate_all('s => s.forEach(x => x.remove())')
    pg.dblclick('#trash'); pg.wait_for_timeout(1300)
    assert pg.locator('.scrap').count() == 2; print('双击爆炸 OK')
    pg.mouse.click(250, 200); pg.keyboard.type('今天又开了三个会…'); pg.mouse.click(820, 380); pg.keyboard.type('周末想去爬山')
    pg.wait_for_timeout(300)
    pg.screenshot(path=os.path.join(ROOT, 'docs', 'screenshot.png'))
    pg.click('#btn-list'); pg.fill('#search', '咖啡'); assert pg.locator('.note-item').count() == 1; print('搜索 OK')
    b.close()
srv.shutdown()
assert not errors, errors
print('控制台无报错，全部通过')
