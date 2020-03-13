var db = {
  warning: ['https://www.kcg.gov.tw/*', 'https://kcginfo.kcg.gov.tw/*'],
  danger: ['https://www.chinatimes.com/*', 'http://www.ctitv.com.tw/*']
}

var warningCallback = function (details) {
  if (confirm("警告!你即將進入管制地帶，請問你仍要進入網站嗎?")) {
    chrome.webRequest.onBeforeRequest.removeListener(warningCallback)
    chrome.notifications.create('confirmWeb', {
      type: 'basic',
      iconUrl: 'icons/icon16.png',
      title: '關閉監控!',
      message: '已經關閉對warning等級的監控！'
    })
  } else {
    return {
      redirectUrl: 'https://www.google.com/'
    }
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  warningCallback, {
    urls: db.warning
  }, //需是陣列型態
  ['blocking']
)

chrome.webRequest.onCompleted.addListener(
  warningCallback, {
    urls: db.warning
  }, //需是陣列型態
  ['blocking']
)