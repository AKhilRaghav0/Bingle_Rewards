chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var url = details.url.replace("www.google.com/search", "www.bing.com/search");
    var moddedURL = url.split('&');
    if (moddedURL[moddedURL.length - 1].includes('#q=')){
        url = toOneQuery(moddedURL);
    }
    openTab(url, true, function(tabId) {
        closeTab(tabId);
    });
}, {urls: ["*://www.google.com/search*"]}, ["blocking"] );

function openTab(url, inBackground, callback){
    chrome.tabs.create({'url': url, 'active': !inBackground}, function(tab) {
        if (inBackground) {
            chrome.tabs.update(tab.id, {active: false});
        }
        callback(tab.id);
    });
}

function closeTab(tabId){
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo){
        if (changeInfo.status === "complete") {
            chrome.tabs.remove(tabId);
            chrome.tabs.onUpdated.removeListener(listener);
        }
    });
}

