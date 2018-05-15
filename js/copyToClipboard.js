function copyToClipboard(text, html) {
    function oneCopy(event) {
        document.removeEventListener("copy", oneCopy, true);
        event.stopImmediatePropagation();
        event.preventDefault();
        event.clipboardData.setData("text/plain", text);
        event.clipboardData.setData("text/html", html);
    }

    document.addEventListener("copy", oneCopy, true);
    document.execCommand("copy");
}
