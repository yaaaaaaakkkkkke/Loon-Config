// JD cookie capture notifier v2
// 每次必弹通知 + 按 NobyDa 约定写入 CookiesJD（签到脚本读取的 key）
const req = $request;
if (req.method != 'OPTIONS' && req.headers) {
  const CV = (req.headers['Cookie'] || req.headers['cookie'] || '');
  const ckItems = CV.match(/(pt_key|pt_pin)=.+?;/g);
  if (ckItems && ckItems.length == 2) {
    const cookie = ckItems.join('');
    const pinRaw = (CV.match(/pt_pin=([^;]+)/) || [])[1] || '';
    let pin = pinRaw;
    try { pin = decodeURIComponent(pinRaw); } catch (e) {}
    let total = [];
    try { total = JSON.parse($persistentStore.read('CookiesJD') || '[]'); } catch (e) { total = []; }
    for (const k of ['CookieJD', 'CookieJD2']) {
      const old = $persistentStore.read(k);
      if (old && !total.some(x => x.cookie === old)) total.push({ cookie: old });
    }
    function pinOf(ck) {
      const m = (ck || '').match(/pt_pin=([^;]+)/);
      if (!m) return '';
      try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
    }
    let idx = -1;
    for (let i = 0; i < total.length; i++) {
      if (pinOf(total[i].cookie) === pin) { idx = i; break; }
    }
    let status;
    if (idx === -1) {
      total.push({ cookie: cookie });
      status = '写入京东 [账号' + total.length + '] Cookie成功 🎉';
    } else if (total[idx].cookie === cookie) {
      status = '京东 [账号' + (idx + 1) + '] Cookie未变化（已存在）✅';
    } else {
      total[idx].cookie = cookie;
      status = '更新京东 [账号' + (idx + 1) + '] Cookie成功 🎉';
    }
    $persistentStore.write(JSON.stringify(total, null, 2), 'CookiesJD');
    $notification.post('京东签到', '用户: ' + pin, status + '｜明天8:15自动签到');
  } else {
    $notification.post('京东签到', '', '⚠️ 缺少 pt_key/pt_pin，请在 Safari 网页端操作，勿在 App 内获取');
  }
}
$done({});
