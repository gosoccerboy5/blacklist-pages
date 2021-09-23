chrome.storage.sync.get("urls", ({urls}) => {
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
        deleteBtn.addEventListener("click", function(e) {
            const idNumber = i;
            if (confirm("Do you want to delete this url (" + 
            document.querySelector(`#input${idNumber}`).value + 
            ") from the blacklist?")) {
                document.querySelector(`#input${idNumber}`).remove();
                document.querySelector(`#br${idNumber}`).remove();
                this.remove();
            }
        });
        document.body.append(deleteBtn);
        br.id = `br${i}`;
        document.body.append(br);
        lastId = i;
        console.log(lastId);
    }

    const useRegexCheckbox = document.querySelector("#useRegex");
    chrome.storage.sync.get("useRegex", ({useRegex}) => {
        useRegexCheckbox.checked = useRegex;
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save changes";
    saveButton.addEventListener("click", function(event) {
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


    const addButton = document.querySelector("#addUrl");
    addButton.addEventListener("click", function(event) {
        lastId++;
        const input = document.createElement("input"),
            br = document.createElement("br"),
            deleteBtn = document.createElement("button");
        input.id = `input${lastId}`;
        deleteBtn.textContent = "Delete";
        deleteBtn.id = `deleteBtn${lastId}`;
        br.id = `br${lastId}`;
        input.value = "";
        document.body.insertBefore(input, saveButton);
        document.body.insertBefore(deleteBtn, saveButton);
        document.body.insertBefore(br, saveButton);
        deleteBtn.addEventListener("click", function(e) {
            const idNumber = lastId;
            if (confirm("Do you want to delete this url (" + 
            document.querySelector(`#input${idNumber}`).value + 
            ") from the blacklist?")) {
                document.querySelector(`#input${idNumber}`).remove();
                document.querySelector(`#br${idNumber}`).remove();
                this.remove();
            }
        });
    });
});

// this is terrible code alreay
// need to refactor
// and add comments (within a week I will forget how this works)