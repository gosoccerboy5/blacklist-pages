async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
// https://stackoverflow.com/a/48161723/15938577 is a total lifesaver

chrome.storage.sync.get(["hasSetPassword", "password"], ({hasSetPassword, password}) => {
    const oldPwd = document.createElement("input");
    const newPwd = document.querySelector("#newPassword");
    const savePwd = document.querySelector("#savePassword");
    const newPwdLabel = document.querySelector("#newPasswordLabel");
    oldPwd.id = "oldPassword";
    if (hasSetPassword) {
        const newLabel = document.createElement("label");
        newLabel.setAttribute("for", "oldPassword");
        newLabel.textContent = "Old password:";
        document.body.insertBefore(newLabel, newPwdLabel);
        document.body.insertBefore(oldPwd, newPwdLabel);
        document.body.insertBefore(document.createElement("br"), newPwdLabel);        
    }
    savePwd.addEventListener("click", async function(e) {
        if (newPwd.value !== "") {
            if (!hasSetPassword || password === await sha256(oldPwd.value)) {
                chrome.storage.sync.set({
                    password: await sha256(newPwd.value),
                    hasSetPassword: true,
                });
                alert("Password saved successfully." +
                "\nDon't forget this password! Keep it somewhere safe if you need to.");
                window.location.reload();
            } else if (password !== await sha256(oldPwd.value)) {
                alert("The password you inputted to the old password input is not equal to your old password!");
            }
        }
    });
});
