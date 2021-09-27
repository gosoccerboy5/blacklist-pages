chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    urls: [
      "example.com", 
    ], 
    useRegex: false,
    hasSetPassword: false,
  });
  chrome.tabs.create({
    url:  `chrome-extension://${chrome.runtime.id}/options.html`
  }, null);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'optionsPage') {
    chrome.tabs.create({
      url:  `chrome-extension://${chrome.runtime.id}/options.html`
    }, null);
  }
});
// Thx to https://stackoverflow.com/a/22763218/15938577

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'setPasswordPage') {
    chrome.tabs.create({
      url:  `chrome-extension://${chrome.runtime.id}/setPassword.html`
    }, null);
  }
});