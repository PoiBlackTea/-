// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.commands.onCommand.addListener(function (command) {
  console.log('onCommand event received for message: ', command);
});


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

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    chrome.notifications.create('cancelWeb', {
      type: 'basic',
      iconUrl: 'icons/icon16.png',
      title: '網站封鎖!',
      message: '您前往的網站已封鎖，無法瀏覽！'
    })
    return {
      cancel: true
    }
  }, {
    urls: db.danger
  }, //需是陣列型態
  ['blocking']
)