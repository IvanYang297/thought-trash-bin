"""冒烟测试：python3 tests/smoke_test.py（需 pip install playwright && playwright install chromium）"""
import re, http.server, threading, functools, os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8766), functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
errors = []
with sync_playwright() as p:
    b = p.chromium.launch()
    # 离线测试：拦掉 Cloudflare 统计脚本（静默返回空脚本，避免网络错误进控制台）
    def block_cf(ctx): ctx.route(re.compile(r'https://(static\.)?cloudflareinsights\.com/.*'), lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
    _new_ctx = b.new_context
    def new_context(fresh=False, **kw):
        c = _new_ctx(**kw); block_cf(c)
        if not fresh: c.add_init_script("localStorage.setItem('ttb.landed','1'); localStorage.setItem('ttb.toured','1')")  # 老用户：跳过落地页和引导
        return c
    b.new_context = new_context
    pg = b.new_context(viewport={'width': 1280, 'height': 800}).new_page()
    cf_req = []; pg.on('request', lambda r: 'cloudflareinsights' in r.url and cf_req.append(r.url))
    pg.on('console', lambda m: m.type == 'error' and errors.append(m.text))
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('http://127.0.0.1:8766/index.html'); pg.wait_for_selector('.bubble')
    pg.wait_for_load_state('load')
    assert cf_req and pg.locator('script[data-cf-beacon]').count() == 1; print('Cloudflare 统计脚本已引入（测试中已拦截）OK')
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
    pg.click('#btn-list'); pg.wait_for_selector('.note-item'); pg.fill('#search', '咖啡'); assert pg.locator('.note-item').count() == 1; print('搜索 OK')
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
    # 心情标签提示气泡：鼠标悬停 / 触屏点按 / 选中取消
    pg.click('#btn-add'); tb = pg.locator('.bubble').last
    tipv = lambda: pg.evaluate("(() => { const t = document.querySelector('#tag-tip'); return t ? [t.textContent, +getComputedStyle(t).opacity] : null; })()")
    btn = tb.locator('[data-tag=idea]'); assert btn.get_attribute('aria-label') == '灵感' and not btn.get_attribute('title')
    sz = tb.locator('.tag-picker button').evaluate_all("bs => bs.map(b => { const r = b.getBoundingClientRect(), v = b.querySelector('.tg').getBoundingClientRect(); return [r.width, r.height, v.width, parseFloat(getComputedStyle(b.querySelector('.tg')).fontSize)]; })")
    assert all(w >= 39.99 and h >= 39.99 and 30 <= v <= 34 and f == 20 for w, h, v, f in sz), sz
    pr = tb.locator('.tag-picker').bounding_box(); bbx = tb.bounding_box()
    assert pr['x'] >= bbx['x'] and pr['x'] + pr['width'] <= bbx['x'] + bbx['width'] and pr['y'] + pr['height'] <= bbx['y'] + bbx['height'], (pr, bbx)
    print('标签按钮尺寸 OK', sz[0])
    btn.hover(force=True); pg.wait_for_timeout(250); assert tipv() == ['灵感', 1], tipv()
    tr = pg.locator('#tag-tip').bounding_box(); br = btn.bounding_box()
    assert tr['y'] + tr['height'] <= br['y'] and pg.evaluate("document.querySelector('#tag-tip').parentElement === document.body")  # 在按钮上方、不在对话框里，不会被裁
    pg.mouse.move(5, 300); pg.wait_for_timeout(350); assert tipv()[1] == 0
    btn.click(force=True); pg.wait_for_timeout(200); assert tipv() == ['已选：灵感', 1], tipv()
    pg.wait_for_timeout(150); assert tipv() == ['已选：灵感', 1]
    pg.screenshot(path=os.path.join(ROOT, 'docs', 'mood-tooltip.png'))
    btn.click(force=True); pg.wait_for_timeout(200); assert tipv()[0] == '已取消'
    pg.wait_for_timeout(1700); assert tipv()[1] == 0, '约 1.5 秒后淡出'
    # 触屏：用触摸指针事件点按（无悬停）
    pg.evaluate("""() => { const b = [...document.querySelectorAll('.bubble')].pop().querySelector('[data-tag=heart]'), r = b.getBoundingClientRect(), o = { bubbles: true, pointerType: 'touch', isPrimary: true, clientX: r.x + 5, clientY: r.y + 5, pointerId: 7 };
      b.dispatchEvent(new PointerEvent('pointerover', o)); b.dispatchEvent(new PointerEvent('pointerdown', o)); b.dispatchEvent(new PointerEvent('pointerup', o)); b.click(); }""")
    pg.wait_for_timeout(200); assert tipv() == ['已选：心里话', 1], tipv()
    pg.wait_for_timeout(1700); assert tipv()[1] == 0
    pg.locator('.bubble').last.evaluate('b => b.remove()')
    print('心情标签提示气泡 OK（悬停 / 选中 / 取消 / 触屏 1.5 秒淡出）')
    # 5. 自定义横幅：列表里「加到横幅」+ 设置里添加/移除
    pg.click('#btn-list'); pg.wait_for_selector('.note-item .to-banner'); pg.locator('.note-item .to-banner').first.click()
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
    # 对话框上限 10 个
    for _ in range(12): pg.click('#btn-add')
    assert pg.locator('.bubble').count() == 10 and '最多 10 个' in pg.text_content('#toast')
    pg.evaluate('document.activeElement.blur()'); pg.keyboard.press('n'); pg.keyboard.press('Control+Alt+n'); pg.mouse.click(300, 420)
    assert pg.locator('.bubble').count() == 10; print('对话框上限 10 个 OK')
    pg.locator('.bubble').evaluate_all('bs => bs.forEach(b => b.remove())')
    # 流畅拖拽：拖动中只改 transform、暂停漂浮，松手后落到 left/top
    pg.click('#btn-add'); bub = pg.locator('.bubble').last; bub.locator('textarea').fill('拖着走')
    left0 = bub.evaluate('b => b.style.left'); g = bub.locator('.grip').bounding_box()
    pg.mouse.move(g['x'] + 20, g['y'] + 7); pg.mouse.down(); pg.mouse.move(g['x'] + 120, g['y'] + 47, steps=8); pg.wait_for_timeout(50)
    st = bub.evaluate("b => [b.style.left, b.style.transform, getComputedStyle(b).animationName]")
    assert st[0] == left0 and 'translate3d(100px, 40px' in st[1] and st[2] == 'none', st
    pg.mouse.up()
    st = bub.evaluate("b => [parseFloat(b.style.left), b.style.transform]")
    assert abs(st[0] - (float(left0[:-2]) + 100)) < 1 and st[1] == '', st
    calls = pg.evaluate("""() => new Promise(res => { const b = document.querySelector('.bubble'), g = b.querySelector('.grip').getBoundingClientRect();
      let n = 0; const orig = Element.prototype.getBoundingClientRect; Element.prototype.getBoundingClientRect = function () { n++; return orig.call(this); };
      const ev = (t, x, y) => b.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: x, clientY: y, pointerId: 1, button: 0 }));
      ev('pointerdown', g.x + 5, g.y + 5); n = 0; for (let i = 1; i <= 30; i++) ev('pointermove', g.x + 5 + i, g.y + 5);
      requestAnimationFrame(() => { ev('pointerup', g.x + 35, g.y + 5); Element.prototype.getBoundingClientRect = orig; res(n); }); })""")
    assert calls == 0, f'拖动中调用了 {calls} 次 getBoundingClientRect'
    print('流畅拖拽 OK（transform + rAF，拖动中不量布局）')
    # 三连击飞进桶
    c0 = int(pg.text_content('#count'))
    pg.locator('.bubble textarea').last.click(click_count=3, force=True); pg.wait_for_timeout(900)
    assert int(pg.text_content('#count')) == c0 + 1 and pg.locator('.bubble').count() == 0
    pg.click('#btn-add'); e = pg.locator('.bubble').last
    box = e.bounding_box(); e.click(position={'x': 6, 'y': box['height'] - 8}, click_count=3, force=True); pg.wait_for_timeout(700)
    assert int(pg.text_content('#count')) == c0 + 1 and pg.locator('.bubble').count() == 1 and '桶不吃' in pg.text_content('#toast')
    pg.locator('.bubble').evaluate_all('bs => bs.forEach(b => b.remove())')
    n2 = pg.evaluate("""() => new Promise(r => { const q = indexedDB.open('thought-trash-bin'); q.onsuccess = () => {
        const g = q.result.transaction('notes').objectStore('notes').getAll(); g.onsuccess = () => r(g.result.map(x => x.text)); }; })""")
    assert '拖着走' in n2; print('三连击飞进桶 OK（空的弹一下不保存）')
    # 使用须知 + Esc
    # 使用须知：悬停小卡片
    pg.evaluate("document.querySelector('#toast').classList.remove('show')")
    vis = lambda: pg.evaluate("getComputedStyle(document.querySelector('#help-pop')).visibility") == 'visible'
    pg.mouse.move(5, 300); pg.hover('#btn-help'); pg.wait_for_timeout(60); assert not vis(), '应有约 150ms 延迟'
    pg.wait_for_timeout(300); assert vis()
    h = pg.text_content('#help-pop')
    for k in ['Ctrl', 'Alt', '10', '三下', '双击', '连点 5 下', '心情标签', '搜索', 'AI', '复制整理提示词', '本周回顾', '横幅', 'Esc']: assert k in h, k
    box = pg.locator('#help-pop').bounding_box(); bb = pg.locator('#btn-help').bounding_box()
    assert 280 <= box['width'] <= 320 and box['y'] >= bb['y'] + bb['height'] and abs((box['x'] + box['width']) - (bb['x'] + bb['width'])) < 30, box
    assert pg.locator('#panel.hidden').count() == 1  # 不再打开大面板
    pg.wait_for_timeout(200); pg.mouse.move(14, 14)  # 先把光标挪开拍图（拍之前确认仍在）
    pg.hover('#btn-help'); pg.wait_for_timeout(400)
    pg.mouse.move(box['x'] + 150, box['y'] + 60, steps=5); pg.wait_for_timeout(400); assert vis(), '悬停在卡片上应保持'
    pg.screenshot(path=os.path.join(ROOT, 'docs', 'help.png'))
    pg.mouse.move(400, 400); pg.wait_for_timeout(80); assert vis(); pg.wait_for_timeout(400); assert not vis(), '离开约 200ms 后隐藏'
    pg.click('#btn-help'); pg.wait_for_timeout(250); assert vis() and pg.locator('#panel.hidden').count() == 1
    pg.keyboard.press('Escape'); pg.wait_for_timeout(250); assert not vis()
    pg.mouse.move(400, 400); pg.evaluate('document.activeElement.blur()'); pg.wait_for_timeout(300)
    pg.focus('#btn-help'); pg.wait_for_timeout(250); assert vis(), '键盘聚焦应显示'
    pg.keyboard.press('Escape'); pg.wait_for_timeout(250); assert not vis(); pg.evaluate('document.activeElement.blur()')
    print('使用须知悬停卡片 OK（延迟显示 / 悬停保持 / 延迟隐藏 / 聚焦 / Esc）')
    # 2. 越吃越满 + 打嗝
    pg.evaluate("async () => { const s = await import('/js/storage.js'); const t = ['会议又拖堂了','想换个工位','学点 Python','周报又写不完','领导画饼','想去旅行','加班到十点','想养只猫','中午吃啥','需求又改了','想早睡','买个人体工学椅','同事好吵','想学吉他','工资何时涨','咖啡喝太多','想辞职','周末去爬山']; const tg = ['rant','idea','heart','']; for (let i = 0; i < 16; i++) await s.saveNote(t[i], tg[i % 4]); }")
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
    # 面板：与使用须知同款小卡片，挂在各自按钮下，点击开关 / 点外面 / Esc 关闭，不挡桶
    pg.evaluate("document.querySelector('#toast').classList.remove('show')")
    tb = pg.locator('#trash').bounding_box()
    hp = pg.evaluate("getComputedStyle(document.querySelector('#help-pop')).fontSize")
    for btn, shot in [('#btn-list', 'list-panel.png'), ('#btn-settings', 'settings-panel.png'), ('#btn-ai', 'ai-panel.png')]:
        pg.click(btn); pg.wait_for_timeout(300)
        pb = pg.locator('#panel').bounding_box(); bb = pg.locator(btn).bounding_box()
        assert 290 <= pb['width'] <= 310 and pb['height'] <= 800 * 0.7 + 1, (btn, pb)
        assert 0 <= pb['y'] - (bb['y'] + bb['height']) <= 14 and abs((pb['x'] + pb['width']) - (bb['x'] + bb['width'])) < 2, (btn, pb, bb)
        ar = pg.evaluate("(() => { const p = document.querySelector('#panel'), s = getComputedStyle(p, '::before'); return p.getBoundingClientRect().right - parseFloat(s.right) - 6; })()")
        assert abs(ar - (bb['x'] + bb['width'] / 2)) < 4, (btn, ar, bb)  # 小箭头指向按钮
        assert pg.evaluate("getComputedStyle(document.querySelector('#panel')).fontSize") == hp
        assert not (pb['x'] < tb['x'] + tb['width'] and pb['x'] + pb['width'] > tb['x'] and pb['y'] + pb['height'] > tb['y']), ('挡住桶了', btn, pb, tb)
        if btn == '#btn-list':
            sc = pg.evaluate("(() => { const i = document.querySelector('#items'); return [i.scrollHeight > i.clientHeight, getComputedStyle(i).overflowY]; })()")
            assert sc == [True, 'auto'], sc
            s0 = pg.locator('#search').bounding_box()
            pg.evaluate("document.querySelector('#items').scrollTop = 99999"); pg.wait_for_timeout(100)
            assert pg.locator('#search').bounding_box() == s0; pg.evaluate("document.querySelector('#items').scrollTop = 0")
            pg.fill('#search', 'x'); pg.fill('#search', '')  # 在里面打字不会关闭
            assert pg.locator('#panel.hidden').count() == 0
        if btn == '#btn-ai':
            assert pg.locator('#mystic').inner_text().strip() == '🔮 复制玄学解读提示词'
            pg.evaluate("window.__clip = ''; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async t => { window.__clip = t; } } })")
            pg.click('#mystic'); pg.wait_for_timeout(200)
            clip = pg.evaluate('window.__clip')
            assert '仅供娱乐' in clip and '【今日签文】' in clip and '宜：' in clip and '幸运色' in clip and '第 ' in clip, clip[:200]
            assert pg.locator('#toast.show').count() == 1
            pg.evaluate("document.querySelector('#toast').classList.remove('show')")
            print('玄学解读提示词复制 OK')
        pg.wait_for_timeout(100); pg.screenshot(path=os.path.join(ROOT, 'docs', shot))
        print('面板小卡片 OK', btn, {k: round(v) for k, v in pb.items()})
    pg.click('#btn-ai'); assert pg.locator('#panel.hidden').count() == 1, '再点按钮应关闭'
    pg.click('#btn-ai'); pg.mouse.click(60, 300); assert pg.locator('#panel.hidden').count() == 1, '点外面应关闭'
    pg.locator('.bubble').evaluate_all('bs => bs.forEach(b => b.remove())')
    pg.click('#btn-list'); pg.keyboard.press('Escape'); assert pg.locator('#panel.hidden').count() == 1
    print('面板开关 OK（按钮切换 / 点外面 / Esc）')
    # 3. 本周回顾卡片 + 下载 PNG
    pg.click('#btn-review'); pg.wait_for_selector('#review canvas')
    with pg.expect_download() as dl: pg.click('#review-dl')
    dl.value.save_as(os.path.join(ROOT, 'docs', 'review-card.png'))
    assert os.path.getsize(os.path.join(ROOT, 'docs', 'review-card.png')) > 10000
    # 分享：不支持系统分享时 -> 下载 PNG + 复制网址
    pg.evaluate("window.__clip = ''; Object.defineProperty(navigator, 'canShare', { configurable: true, value: undefined }); Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async t => { window.__clip = t; } } })")
    with pg.expect_download() as dl2: pg.click('#review-share')
    assert dl2.value.suggested_filename.endswith('.png'); pg.wait_for_timeout(200)
    assert pg.evaluate('window.__clip') == 'https://thought-trash-bin.pages.dev/' and '网址已复制' in pg.text_content('#toast')
    # 支持系统分享时 -> navigator.share 带 PNG 文件
    pg.evaluate("() => { window.__shared = null; Object.defineProperty(navigator, 'canShare', { configurable: true, value: d => !!(d && d.files) }); Object.defineProperty(navigator, 'share', { configurable: true, value: async d => { window.__shared = [d.files[0].type, d.files[0].size, d.text]; } }); }")
    pg.click('#review-share'); pg.wait_for_function('window.__shared')
    sh = pg.evaluate('window.__shared'); assert sh[0] == 'image/png' and sh[1] > 10000 and 'pages.dev' in sh[2], sh
    pg.click('#review-close'); print('本周回顾分享 OK（系统分享 / 下载+复制网址）')
    # SEO 基础
    meta = pg.evaluate("() => Object.fromEntries([...document.querySelectorAll('meta[name],meta[property]')].map(m => [m.getAttribute('name') || m.getAttribute('property'), m.content]))")
    assert '会“吃”想法' in meta['description'] and meta['og:image'] == 'https://thought-trash-bin.pages.dev/assets/og-image.png' and meta['twitter:card'] == 'summary_large_image', meta
    import urllib.request
    for f in ('robots.txt', 'sitemap.xml', 'favicon.svg', 'favicon.png', 'assets/og-image.png', 'assets/apple-touch-icon.png'):
        assert urllib.request.urlopen('http://127.0.0.1:8766/' + f).status == 200, f
    assert Image.open(os.path.join(ROOT, 'assets', 'og-image.png')).size == (1200, 630)
    print('SEO：description / OG / Twitter / favicon / robots / sitemap OK')
    st = pg.evaluate("async () => { const r = await import('/js/review.js'), s = await import('/js/storage.js'); return r.weekStats(await s.listNotes()); }")
    assert st['total'] == 100 and st['by'] == {'rant': 5, 'idea': 5, 'heart': 4, 'none': 86}, st
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
    fp2.goto('http://127.0.0.1:8766/index.html'); fp2.wait_for_selector('#review canvas')
    fp2.reload(); fp2.wait_for_selector('.bubble'); fp2.wait_for_timeout(500); assert fp2.locator('#review').count() == 0
    fri.close(); print('本周回顾 OK（统计 / 下载 PNG / 周五自动弹一次）', st)
    # 首次访问：落地页 -> 7 步引导（下一步 / 跳过），只出现一次，可从使用须知重开
    oc = b.new_context(fresh=True, viewport={'width': 1280, 'height': 800}); op = oc.new_page()
    op.on('console', lambda m: m.type == 'error' and errors.append(m.text)); op.on('pageerror', lambda e: errors.append(str(e)))
    op.goto('http://127.0.0.1:8766/index.html'); op.wait_for_selector('#landing:not([hidden])')
    assert op.inner_text('#landing h1') == '思绪垃圾桶' and op.inner_text('#land-enter') == '进入垃圾桶 →' and '这是什么' in op.inner_text('#landing')
    op.screenshot(path=os.path.join(ROOT, 'docs', 'landing.png'))
    op.click('#land-enter'); op.wait_for_selector('#tour-tip')
    assert '想到什么就写在这张卡片上' in op.inner_text('#tour-tip') and op.locator('.bubble.tour-mark').count() == 1
    seen = []
    for i in range(10):
        seen.append(op.inner_text('#tour-tip p'))
        if i == 2: op.wait_for_timeout(400); op.screenshot(path=os.path.join(ROOT, 'docs', 'onboarding.png'))
        btn = op.locator('#tour-tip .next')
        if btn.inner_text() == '开始扔吧': btn.click(); break
        btn.click()
    assert len(seen) == 7 and '随时点这里' in seen[-1] and op.locator('#tour-tip').count() == 0 and op.locator('.tour-mark').count() == 0, seen
    op.reload(); op.wait_for_selector('.bubble'); op.wait_for_timeout(600)
    assert op.locator('#landing').is_hidden() and op.locator('#tour-tip').count() == 0, '回访应自动跳过'
    op.hover('#btn-help'); op.wait_for_selector('#help-pop.show'); assert 'v1.1' in op.inner_text('#help-pop .help-title'); op.click('#help-tour'); op.wait_for_selector('#tour-tip')
    op.click('#tour-tip .skip'); assert op.locator('#tour-tip').count() == 0
    oc.close(); print('落地页 + 引导（7 步 / 跳过 / 只一次 / 可重开）OK')
    # 备份提醒：未备份 10 条弹一次，之后每 +20；工具栏「导出备份」可见
    bc = b.new_context(viewport={'width': 1280, 'height': 800}, accept_downloads=True); bp = bc.new_page()
    bp.on('console', lambda m: m.type == 'error' and errors.append(m.text)); bp.on('pageerror', lambda e: errors.append(str(e)))
    bp.goto('http://127.0.0.1:8766/index.html'); bp.wait_for_selector('.bubble')
    assert bp.locator('#toolbar #btn-backup').is_visible()
    nudge = lambda k: bp.evaluate(f"async () => {{ const s = await import('/js/storage.js'); for (let i = 0; i < {k}; i++) await s.saveNote('备份测试 ' + i); return (await import('/js/backup.js')).maybeNudge(); }}")
    assert nudge(9) is False and bp.locator('#backup-nudge').count() == 0
    assert nudge(1) is True and bp.locator('#backup-nudge').is_visible()
    bp.click('#backup-nudge .x'); assert bp.locator('#backup-nudge').count() == 0
    assert nudge(19) is False and nudge(1) is True
    with bp.expect_download() as bd: bp.click('#backup-nudge .go')
    assert bd.value.suggested_filename.endswith('.md') and bp.locator('#backup-nudge').count() == 0
    assert nudge(9) is False and nudge(1) is True  # 导出后重新计数
    with bp.expect_download(): bp.click('#btn-backup')
    bc.close(); print('备份提醒 + 工具栏导出备份 OK')
    # 回归：删除按钮（不依赖原生 confirm，Playwright 默认会自动取消原生弹窗 = 用户看到的「点了没反应」）
    # + 窗口较矮时第二次打开列表不能是空白（列表区曾被挤成 0 高度）
    dc = b.new_context(viewport={'width': 1280, 'height': 600}); dp = dc.new_page()
    dp.on('console', lambda m: m.type == 'error' and errors.append(m.text)); dp.on('pageerror', lambda e: errors.append(str(e)))
    dp.goto('http://127.0.0.1:8766/index.html'); dp.wait_for_selector('.bubble')
    dp.evaluate("async () => { const s = await import('/js/storage.js'); for (let i = 0; i < 6; i++) await s.saveNote('删除测试 ' + i); (await import('/js/trashbin.js')).setCount(await s.countNotes()); }")
    for i in range(3):
        dp.click('#btn-list'); dp.wait_for_selector('#items .note-item')
        h = dp.evaluate("document.querySelector('#items').clientHeight"); vis = dp.locator('#items .note-item').first.is_visible()
        assert dp.locator('#items .note-item').count() == 6 and h >= 100 and vis, (i, h)
        dp.click('#btn-list'); assert dp.locator('#panel.hidden').count() == 1
    dp.click('#btn-list'); dp.wait_for_selector('#items .note-item')
    dp.locator('.note-item .del').first.click()
    assert dp.locator('.note-item .ask').inner_text() == '确定删除这条吗？'
    dp.locator('.note-item .no').click(); assert dp.locator('#items .note-item').count() == 6
    dp.locator('.note-item .del').first.click(); dp.locator('.note-item .yes').click(); dp.wait_for_timeout(300)
    assert dp.locator('#items .note-item').count() == 5 and dp.text_content('#count') == '5'
    assert dp.evaluate("async () => (await import('/js/storage.js')).countNotes()") == 5
    dp.keyboard.press('Escape'); dp.click('#btn-list'); dp.wait_for_selector('#items .note-item')
    assert dp.locator('#items .note-item').count() == 5; dc.close()
    print('删除确认 + 计数更新 + 反复开关列表不空白 OK')
    # 默认状态截图：全新上下文（无存储），所有对话框为空、只显示淡色提示语
    ctx = b.new_context(viewport={'width': 1280, 'height': 800}); fp = ctx.new_page()
    fp.on('pageerror', lambda e: errors.append(str(e)))
    fp.goto('http://127.0.0.1:8766/index.html'); fp.wait_for_selector('.bubble')
    vals = fp.locator('.bubble textarea').evaluate_all('ts => ts.map(t => [t.value, t.placeholder])')
    assert vals and all(v == '' and ph for v, ph in vals), vals
    assert fp.get_attribute('#trash', 'data-state') == 'happy' and float(fp.get_attribute('#trash', 'data-mood')) == 0 and 'Q120.0 192.0' in fp.get_attribute('#mouth-smile', 'd')
    fp.evaluate('document.activeElement.blur()'); fp.wait_for_timeout(500)
    fp.screenshot(path=os.path.join(ROOT, 'docs', 'screenshot.png'))
    fp.click('#btn-list'); fp.wait_for_timeout(200); eb = fp.locator('#panel').bounding_box()
    assert eb['height'] < 200 and '还没有想法' in fp.text_content('#items'), eb
    fp.keyboard.press('Escape'); fp.wait_for_timeout(100); print('空状态面板紧凑 OK，高', round(eb['height']))
    mob = b.new_context(viewport={'width': 390, 'height': 800}, has_touch=True, is_mobile=True); mp = mob.new_page()
    mp.on('pageerror', lambda e: errors.append(str(e)))
    mp.goto('http://127.0.0.1:8766/index.html'); mp.wait_for_selector('.bubble')
    ms = mp.locator('.bubble .tag-picker button').first.evaluate("b => [b.getBoundingClientRect().width, parseFloat(getComputedStyle(b.querySelector('.tg')).fontSize)]")
    assert ms[0] >= 48 and ms[1] >= 24, ms
    mp.locator('.bubble [data-tag=rant]').first.tap(force=True); mp.wait_for_timeout(200)
    assert mp.text_content('#tag-tip') == '已选：吐槽'; mob.close(); print('触屏大按钮 + 点按提示 OK', ms)
    print('默认状态全为空提示语 OK:', [ph for _, ph in vals])
    b.close()
srv.shutdown()
assert not errors, errors
print('控制台无报错，全部通过')
