chrome.storage.sync.get(["urls", "useRegex"], ({ urls, useRegex }) => {
    if (urls.some(item => useRegex ?
        RegExp(item).test(window.location.href) :
        window.location.href.includes(item))) {
        document.write(`<style>
        center {
            margin-top: 10%;
            font-size: 1.5rem;
        }
        a {
            color: blue;
        }
        a:active {
            color: red;
        }
        body {
            font-family: sans-serif;
        }
        </style>
        <center>This page was blocked by the "Blacklist Pages" extension.
        <br>
        If you want to unblock this page, please head over to the
        <a href="chrome-extension://${chrome.runtime.id}/options.html"
        id="_openOptionsPage">options page</a>.</center>`);
        document.querySelector("#_openOptionsPage").addEventListener("click",
            (event) => {
                event.preventDefault();
                chrome.runtime.sendMessage({message: "optionsPage"}, () => {});
            }
        );
        document.close();
    }
});