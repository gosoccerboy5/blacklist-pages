const $ = document.querySelector.bind(document);
chrome.storage.sync.get("urls", ({ urls }) => {
    let lastId = 0;
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i],
            textarea = document.createElement("input"),
            deleteBtn = document.createElement("button"),
            br = document.createElement("br");
        textarea.id = `input${i}`;
        textarea.value = url;
        document.body.append(textarea);
        deleteBtn.textContent = "Delete";
        deleteBtn.id = `deleteBtn${i}`;
        deleteBtn.addEventListener("click", function (e) {
            const idNumber = i;
            if ($(`#input${idNumber}`).value === "" ||
                confirm("Do you want to delete this url (" +
                    $(`#input${idNumber}`).value +
                    ") from the blacklist?")) {
                $(`#input${idNumber}`).remove();
                $(`#br${idNumber}`).remove();
                this.remove();
            }
        });
        document.body.append(deleteBtn);
        br.id = `br${i}`;
        document.body.append(br);
        lastId = i;
    }

    const useRegexCheckbox = $("#useRegex");
    chrome.storage.sync.get("useRegex", ({ useRegex }) => {
        useRegexCheckbox.checked = useRegex;
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save changes";
    saveButton.addEventListener("click", function (event) {
        const newUrls = [];
        for (const element of document.querySelectorAll("input[id^=input]")) {
            if (element.value !== "") newUrls.push(element.value);
        }
        chrome.storage.sync.set({
            urls: newUrls,
            useRegex: useRegexCheckbox.checked
        });

    });
    document.body.append(saveButton);


    const addButton = $("#addUrl");
    addButton.addEventListener("click", function (event) {
        lastId++;
        foo({lastId, saveButton});
    });
});

function foo({id, saveButton}) {
    const input = document.createElement("input"),
        br = document.createElement("br"),
        deleteBtn = document.createElement("button");
    input.id = `input${id}`;
    deleteBtn.textContent = "Delete";
    deleteBtn.id = `deleteBtn${id}`;
    br.id = `br${id}`;
    input.value = "";
    document.body.insertBefore(input, saveButton);
    input.focus();
    document.body.insertBefore(deleteBtn, saveButton);
    document.body.insertBefore(br, saveButton);
    deleteBtn.addEventListener("click", function (e) {
        let idNumber = this.id.match(/\d+/)[0];
        if ($(`#input${idNumber}`).value === "" ||
            confirm("Do you want to delete this url (" +
                $(`#input${idNumber}`).value +
                ") from the blacklist?")) {
            $(`#input${idNumber}`).remove();
            $(`#br${idNumber}`).remove();
            this.remove();
        }
    });
}