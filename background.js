// Background scripts has access to every Chrome API (and can listen to the Browser Action)
// but cannot access the current page (but Content Scripts can!)
// Ref: https://robots.thoughtbot.com/how-to-make-a-chrome-extension
var isStarted = false;
var isInitialized = false;
var timer;

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  if (isStarted) {
    clearTimeout(timer);
    isStarted = false;
      chrome.browserAction.setIcon({
          path : "emptyCup.png",
          tabId: tab.id
      });
  }
  else {
    isStarted = true;
    startTimer();
    // Send a message to the active tab (Content Script will receive it)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "init_video"});
      chrome.browserAction.setIcon({
          path : "fullCup.png",
          tabId: activeTab.id
      });
    });
  }
});

// Listen to messages from the Chrome runtime, e.g. from the Content Scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "page_loaded" ) {
      if (isStarted) {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "init_video"});
            chrome.browserAction.setIcon({
                path : "fullCup.png",
                tabId: activeTab.id
            });
          });
      }
    }
  }
);

function startTimer() {
    timer = setInterval(function(){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "trigger_post"});
          });
    }, 5000);
}
chrome.tabs.onCreated.addListener(function(tab) {
  if(isStarted) {
      chrome.tabs.sendMessage(tab.id, {"message": "init_video"});
      chrome.browserAction.setIcon({
          path : "fullCup.png",
          tabId: tab.id
      });
  }
});