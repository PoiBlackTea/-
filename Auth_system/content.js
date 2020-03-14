chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === "padding password") {
        port.onMessage.addListener(function (message) {
            if (message.event === "padding password") {
                console.log(message.password);
                document.getElementById("username").value = message.username;
                document.getElementById("P_model_password").value = message.password['content'];
            }
            port.postMessage({
                content: "OK"
            });
            port.disconnect();
        });
    };
})