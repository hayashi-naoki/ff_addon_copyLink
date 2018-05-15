"use strict";

let CopyLink = function () {
    this.id = 'copy-link-to-clipboard';
    this.title = browser.i18n.getMessage("contextMenuText");
    this.init()
};
CopyLink.prototype = {
    init: function () {
        this.addContextMenu();
        this.addEventListener()
    },
    addContextMenu: function () {
        let self = this;
        browser.contextMenus.create({
            id: self.id,
            title: self.title,
            contexts: ["all"]
        });
    },
    addEventListener: function () {
        browser.contextMenus.onClicked.addListener(this.runCreateLink());
    },
    runCreateLink: function () {
        let self = this;
        return function (info, tab) {
            if (info && info.menuItemId === self.id) {
                let TAB_TITLE = info.selectionText ? info.selectionText : tab.title;
                let TAB_URL = tab.url;
                let CL_TEXT = TAB_TITLE + ' : <' + TAB_URL + '>';
                let CL_HTML = `<a href="${TAB_URL}">${TAB_TITLE}</a>`;

                let code = "copyToClipboard(" +
                    JSON.stringify(CL_TEXT) + "," +
                    JSON.stringify(CL_HTML) + ");";

                browser.tabs.executeScript({
                    code: "typeof copyToClipboard === 'function';",
                }).then((results) => {
                    if (!results || results[0] !== true) {
                        return browser.tabs.executeScript(tab.id, {file: "./js/copyToClipboard.js"});
                    }
                }).then(() => {
                    return browser.tabs.executeScript(tab.id, {
                        code
                    });
                }).then(() => {
                    return self.browserNotify(browser.i18n.getMessage('notifyMessage'))
                }).catch((error) => {
                    self.browserNotify(error.message)
                });
            }
        }
    },
    browserNotify: function (msg) {
        browser.notifications.create({
            "type": 'basic',
            "iconUrl": browser.extension.getURL("icons/icon-add-60.png"),
            "title": browser.i18n.getMessage('notifyTitle'),
            "message": msg
        });
        return true
    }
};

new CopyLink();





