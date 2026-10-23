// JD cookie capture notifier (always notifies, even if unchanged)
// Based on NobyDa JD_DailyBonus GetCookie branch
const req = $request;
if (req.method != 'OPTIONS' && req.headers) {
  const CV = (req.headers['Cookie'] || req.headers['cookie'] || '');
  const ckItems = CV.match(/(pt_key|pt_pin)=.+?;/g);
  if (ckItems && ckItems.length == 2) {
    const pt_pin = (CV.match(/pt_pin=([^;]+)/) || [])[1] || '';
    let pin = pt_pin;
    try { pin = decodeURIComponent(pt_pin); } catch(e) {}
    const prev = $persistentStore.read('JD_Cookie_Last_' + pin);
    $persistentStore.write(CV, 'JD_Cookie_Last_' + pin);
    const status = prev === CV ? 'Cookie未变化（已存在）' : 'Cookie已更新';
    $notification.post('京东签到', '用户: ' + pin, status + '，抓取成功 🎉 明天8:15自动签到');
  } else {
    $notification.post('京东签到', '', '⚠️ 抓取到请求但缺少 pt_key/pt_pin，请在Safari网页端操作，勿在App内获取');
  }
}
$done({});
