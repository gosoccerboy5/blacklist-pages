const $ = document.querySelector.bind(document);

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
// https://stackoverflow.com/a/48161723/15938577 is a total lifesaver

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
        chrome.storage.sync.get(["password", "hasSetPassword"], async ({password, hasSetPassword}) => {
            if (!hasSetPassword) {
                alert("You need to set a password to change the options!");
                chrome.runtime.sendMessage({message: "setPasswordPage"}, () => {});
                return;
            }
            var passwordInput = prompt("What is the password?");
            if (await sha256(passwordInput) === password) {
                const newUrls = [];
                for (const element of document.querySelectorAll("input[id^=input]")) {
                    if (element.value !== "") newUrls.push(element.value);
                }
                chrome.storage.sync.set({
                    urls: newUrls,
                    useRegex: useRegexCheckbox.checked,
                });
                const msg = document.createElement("small");
                msg.textContent = "Changes saved.";
                document.body.append(document.createElement("br"));
                document.body.append(document.createElement("br"));
                document.body.append(msg);
                setTimeout(() => window.location.reload(), 2000);
            } else if (passwordInput !== null) {
                alert("Oh my. The password you inputted is different from your actual password!");
            }
        });
    });
    document.body.append(saveButton);

    const setPasswordLink = document.createElement("a");
    setPasswordLink.href = `chrome-extension://${chrome.runtime.id}/setPassword.html`;
    setPasswordLink.textContent = "Set your password";
    setPasswordLink.addEventListener("click", function(e) {
        e.preventDefault();
        chrome.runtime.sendMessage({message: "setPasswordPage"}, () => {});
    });
    document.body.append(document.createElement("br"));
    document.body.append(setPasswordLink);


    const addButton = $("#addUrl");
    addButton.addEventListener("click", function (event) {
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
    });
});