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
    def face_ok():  # 脸（眼睛+嘴）不能被任何纸团盖住
        r = pg.evaluate("""() => { const f = document.querySelector('#face').getBoundingClientRect();
          const hit = [...document.querySelectorAll('#peek .paper, #overflow .paper, .spray .paper')].filter(c => { const b = c.getBoundingClientRect();
            return b.right > f.left && b.left < f.right && b.bottom > f.top && b.top < f.bottom; }); return hit.length; }""")
        assert r == 0, f'{r} 个纸团盖住了脸'
    def trash_shot(name):
        t = pg.locator('#trash').bounding_box()
        pg.screenshot(path=os.path.join(ROOT, 'docs', name), clip={'x': t['x'] - 140, 'y': t['y'] - 170, 'width': t['width'] + 280, 'height': t['height'] + 210})
    def drop(text, tag=None):
        bub = pg.locator('.bubble').first
        if tag: bub.locator(f'.tag-picker [data-tag={tag}]').click(force=True)
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
    # 表情平滑过渡：笑脸 -> 不开心（等咀嚼结束后约 1 秒）
    from PIL import Image
    drop('老板又让我周末改方案，烦死了')
    moods, frames, want = [], [], [0.0, 0.5, 1.0]
    for _ in range(60):
        m = float(pg.get_attribute('#trash', 'data-mood')); moods.append(m)
        if want and (m >= want[0] - 0.08 if want[0] else m == 0):
            t = pg.locator('#trash').bounding_box(); frames.append(Image.open(__import__('io').BytesIO(pg.screenshot(clip={'x': t['x'] - 10, 'y': t['y'] + 30, 'width': t['width'] + 20, 'height': t['height'] - 20})))); want.pop(0)
        if m == 1: break
        pg.wait_for_timeout(50)
    mids = [m for m in moods if 0.1 < m < 0.9]
    assert moods[0] == 0 and moods[-1] == 1 and len(mids) >= 5, moods
    if len(frames) < 3:
        t = pg.locator('#trash').bounding_box(); frames.append(Image.open(__import__('io').BytesIO(pg.screenshot(clip={'x': t['x'] - 10, 'y': t['y'] + 30, 'width': t['width'] + 20, 'height': t['height'] - 20}))))
    W, H = frames[0].size; strip = Image.new('RGB', (W * 3 + 20, H), '#fff7e0')
    for i, f in enumerate(frames[:3]): strip.paste(f, (i * (W + 10), 0))
    strip.save(os.path.join(ROOT, 'docs', 'face-transition.png'))
    print(f'表情平滑过渡 OK：{len(mids)} 帧中间态，例如', [round(m, 2) for m in mids[:4]])
    drop('想学做咖啡，下个月报个班', 'idea')
    pg.wait_for_timeout(1000)
    assert pg.text_content('#count') == '2', pg.text_content('#count')
    assert pg.get_attribute('#trash', 'data-state') == 'unhappy'
    assert float(pg.get_attribute('#trash', 'data-mood')) == 1 and 'Q120.0 174.0' in pg.get_attribute('#mouth-smile', 'd')
    assert pg.evaluate("getComputedStyle(document.querySelector('#brows')).opacity") == '1' and pg.evaluate("getComputedStyle(document.querySelector('#sweat')).opacity") == '1'
    assert abs(pg.evaluate("new DOMMatrix(getComputedStyle(document.querySelector('#eye-l')).transform).d") - 0.6) < 0.01
    face_ok(); pg.wait_for_timeout(1100); trash_shot('can-unhappy.png'); print('吃完变不开心 OK')
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
    # 1. 心情标签
    tags = {x['text']: x.get('tag') for x in n}
    assert tags['想学做咖啡，下个月报个班'] == 'idea' and not tags['老板又让我周末改方案，烦死了'], tags
    pg.fill('#search', ''); pg.select_option('#tag-filter', 'idea'); assert pg.locator('.note-item').count() == 1
    pg.select_option('#tag-filter', 'none'); assert pg.locator('.note-item').count() == 1
    md = pg.evaluate("async () => (await import('/js/storage.js')).noteToMd({createdAt: Date.now(), text: 'x', tag: 'idea'})")
    assert md.startswith('---\n') and 'tag: idea' in md
    pg.dblclick('#trash'); pg.wait_for_timeout(300)
    assert pg.locator('.scrap[data-tag=idea]').count() == 1; pg.locator('.scrap').evaluate_all('s => s.forEach(x => x.remove())')
    print('心情标签 OK（保存 / front matter / 纸片着色 / 筛选）')
    # 5. 自定义横幅：列表里「加到横幅」+ 设置里添加/移除
    pg.locator('.note-item .to-banner').first.click()
    assert pg.locator('#banner-track span.mine').count() >= 2
    pg.click('#btn-settings'); pg.fill('#banner-input', '今天的我也很棒'); pg.click('#banner-add')
    assert '今天的我也很棒' in pg.text_content('#banner-track')
    assert len(pg.evaluate("JSON.parse(localStorage.getItem('ttb.customBanner'))")) == 2
    pg.locator('#banner-mine button').last.click()
    assert '今天的我也很棒' not in pg.text_content('#banner-track'); print('自定义横幅 OK')
    pg.click('#panel-close')
    # 4. 快捷键
    c0 = pg.locator('.bubble').count()
    pg.evaluate('document.activeElement.blur()'); pg.keyboard.press('n')
    assert pg.locator('.bubble').count() == c0 + 1 and pg.evaluate("document.activeElement.tagName") == 'TEXTAREA'
    pg.keyboard.type('abc'); pg.keyboard.press('Control+Alt+n')  # 在输入框里按 N 不新建，Ctrl+Alt+N 照样新建
    assert pg.locator('.bubble').count() == c0 + 2 and 'abc' in pg.locator('.bubble textarea').nth(c0).input_value()
    pg.locator('.bubble').evaluate_all('bs => bs.forEach(b => b.remove())'); print('快捷键 OK')
    # 2. 越吃越满 + 打嗝
    pg.evaluate("async () => { const s = await import('/js/storage.js'); const t = ['会议又拖堂了','想换个工位','学点 Python','周报又写不完','领导画饼','想去旅行','加班到十点','想养只猫','中午吃啥','需求又改了','想早睡','买个人体工学椅','同事好吵','想学吉他','工资何时涨','咖啡喝太多','想辞职','周末去爬山']; const tg = ['rant','idea','heart','']; for (let i = 0; i < 17; i++) await s.saveNote(t[i], tg[i % 4]); }")
    pg.keyboard.press('Control+Alt+n'); drop('电脑又卡了', 'rant'); pg.wait_for_timeout(1200)
    assert pg.text_content('#count') == '20' and pg.get_attribute('#trash', 'data-state') == 'ajar'
    assert 'burp' in pg.get_attribute('#trash', 'class') and 'AI整理' in pg.text_content('#toast')
    pg.wait_for_timeout(1300)
    assert pg.locator('#peek .paper').count() == 5 and pg.locator('#peek .paper').first.is_visible() and not pg.locator('.spray .paper').first.is_visible()
    ang = pg.evaluate("() => new DOMMatrix(getComputedStyle(document.querySelector('#lid')).transform).b")
    assert ang < -0.05, ang  # 盖子翘起
    face_ok(); trash_shot('can-20.png')
    print('越吃越满 20：盖子翘起 + 纸团挤出 + 打嗝 OK')
    pg.evaluate("async () => { const s = await import('/js/storage.js'); for (let i = 0; i < 80; i++) await s.saveNote('第 ' + i + ' 条乱想', ''); (await import('/js/fill.js')).renderPile(await s.countUnsorted()); (await import('/js/trashbin.js')).setCount(await s.countNotes()); }")
    assert pg.get_attribute('#trash', 'data-state') == 'struggle' and pg.locator('.spray .paper').count() == 8 and pg.locator('#overflow .paper').first.is_visible()
    a = []
    sp, sh = [], []
    for _ in range(12):
        a.append(pg.evaluate("() => new DOMMatrix(getComputedStyle(document.querySelector('.lid-fight')).transform).b"))  # 盖子角度
        sp.append(pg.evaluate("() => { const b = document.querySelector('.spray .paper').getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), +getComputedStyle(document.querySelector('.spray .paper')).opacity]; }"))
        sh.append(pg.evaluate("() => new DOMMatrix(getComputedStyle(document.querySelector('.can')).transform).e"))
        pg.wait_for_timeout(100)
    assert max(a) - min(a) > 0.3, a  # 盖子拉锯（rotate 约 -1° ~ -30°）
    assert len({tuple(x[:2]) for x in sp}) > 5 and max(x[2] for x in sp) > 0.5, sp  # 纸团真的在飞
    assert max(sh) - min(sh) > 2, sh  # 整桶在抖
    face_ok(); pg.wait_for_timeout(400); trash_shot('can-100.png')
    print('100 条：纸团喷出 + 盖子拉锯 OK')
    pg.evaluate("async () => { const s = await import('/js/storage.js'); const ns = await s.listNotes(); await s.markOrganized(ns.filter(n => n.text.startsWith('第 ')).map(n => n.id)); (await import('/js/fill.js')).renderPile(await s.countUnsorted()); }")
    assert pg.get_attribute('#trash', 'data-state') == 'ajar'
    # 3. 本周回顾卡片 + 下载 PNG
    pg.click('#btn-review'); pg.wait_for_selector('#review canvas')
    with pg.expect_download() as dl: pg.click('#review-dl')
    dl.value.save_as(os.path.join(ROOT, 'docs', 'review-card.png'))
    assert os.path.getsize(os.path.join(ROOT, 'docs', 'review-card.png')) > 10000; pg.click('#review-close')
    st = pg.evaluate("async () => { const r = await import('/js/review.js'), s = await import('/js/storage.js'); return r.weekStats(await s.listNotes()); }")
    assert st['total'] == 100 and st['by'] == {'rant': 6, 'idea': 5, 'heart': 4, 'none': 85}, st
    # 反向：全部整理完 -> 平滑变回笑脸
    pg.evaluate("async () => { const s = await import('/js/storage.js'); await s.markOrganized((await s.listNotes()).map(n => n.id)); (await import('/js/fill.js')).renderPile(0); }")
    back = []
    for _ in range(40):
        back.append(float(pg.get_attribute('#trash', 'data-mood'))); pg.wait_for_timeout(50)
        if back[-1] == 0: break
    assert back[-1] == 0 and len([m for m in back if 0.1 < m < 0.9]) >= 5 and pg.get_attribute('#trash', 'data-state') == 'happy', back
    print('整理完平滑变回笑脸 OK')
    fri = b.new_context(viewport={'width': 1280, 'height': 800}); fp2 = fri.new_page()
    fp2.on('pageerror', lambda e: errors.append(str(e)))
    fp2.clock.set_fixed_time('2026-10-23T10:00:00')  # 周五
    fp2.goto('http://127.0.0.1:8765/index.html'); fp2.wait_for_selector('#review canvas')
    fp2.reload(); fp2.wait_for_selector('.bubble'); fp2.wait_for_timeout(500); assert fp2.locator('#review').count() == 0
    fri.close(); print('本周回顾 OK（统计 / 下载 PNG / 周五自动弹一次）', st)
    # 默认状态截图：全新上下文（无存储），所有对话框为空、只显示淡色提示语
    ctx = b.new_context(viewport={'width': 1280, 'height': 800}); fp = ctx.new_page()
    fp.on('pageerror', lambda e: errors.append(str(e)))
    fp.goto('http://127.0.0.1:8765/index.html'); fp.wait_for_selector('.bubble')
    vals = fp.locator('.bubble textarea').evaluate_all('ts => ts.map(t => [t.value, t.placeholder])')
    assert vals and all(v == '' and ph for v, ph in vals), vals
    assert fp.get_attribute('#trash', 'data-state') == 'happy' and float(fp.get_attribute('#trash', 'data-mood')) == 0 and 'Q120.0 192.0' in fp.get_attribute('#mouth-smile', 'd')
    fp.evaluate('document.activeElement.blur()'); fp.wait_for_timeout(500)
    fp.screenshot(path=os.path.join(ROOT, 'docs', 'screenshot.png'))
    print('默认状态全为空提示语 OK:', [ph for _, ph in vals])
    b.close()
srv.shutdown()
assert not errors, errors
print('控制台无报错，全部通过')
