chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    urls: [
      "example.com", 
    ], 
    useRegex: false,
  });
  chrome.tabs.create({
    url:  `chrome-extension://${chrome.runtime.id}/options.html`
  }, null);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'buttonClicked') {
    chrome.tabs.create({
      url:  `chrome-extension://${chrome.runtime.id}/options.html`
    }, null);
  }
});
// Thx to https://stackoverflow.com/a/22763218/15938577