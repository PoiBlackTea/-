document.addEventListener('DOMContentLoaded', () => {
    var SEED;
    var username;
    var query;
    var mode_button = document.getElementById('Connect_button');
    mode_button.addEventListener('click', () => {
        username = document.getElementById('username').value;
        if (document.getElementById('dropdown').value === '') {
            return;
        } else if (username === "") {
            return;
        } else if (document.getElementById('dropdown').value == 'P_model') {
            document.getElementById('password_title').style.display = 'block';
            document.getElementById('myCanvas').style.display = 'none';
        } else if (document.getElementById('dropdown').value == 'PC_model') {
            document.getElementById('password_title').style.display = 'none';
            document.getElementById('myCanvas').style.display = 'block';
        }
        document.getElementById('Auth_button').style.display = 'block';
        var port = chrome.runtime.connect({
            name: "call SEED"
        });
        port.postMessage({
            event: "create SEED",
            name: username
        });
        port.onMessage.addListener(function (response) {
            SEED = response;
            console.log(SEED);
        });

        query = {
            active: true,
            currentWindow: true
        };
        chrome.tabs.query(query, get_current_URL);
    });

    var Auth_button = document.getElementById('Auth_button');

    Auth_button.addEventListener("click", async () => {
        var transform_password = await transform(SEED);
        send_content(username, transform_password);
    });
});

function transform(SEED) {

    if (document.getElementById('dropdown').value == 'P_model') {
        return new Promise((resolve) => {
            var orignal_password = document.getElementById('password').value;
            var port2 = chrome.runtime.connect({
                name: "P model transform password"
            });
            port2.postMessage({
                event: "transform password",
                name: orignal_password,
                SEED: SEED
            });
            port2.onMessage.addListener((response) => {
                resolve(response['content']);
            });
        });
    }
}

function send_content(username, transform_password) {
    //傳username和password到content.js
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        var port3 = chrome.tabs.connect(tabs[0].id, {
            name: "padding password"
        });
        if (transform_password !== '') {
            port3.postMessage({
                event: "padding password",
                username: username,
                password: transform_password
            });
        }
        port3.onMessage.addListener((response) => {
            console.log(response);
        });
    });
}

function get_current_URL(tabs) {

    var currentTab = tabs[0]; // there will be only one in this array
    document.getElementById('url').innerHTML = currentTab.url;
    document.getElementById('current_tabs').style.width = "600px"
    document.getElementById('current_tabs').style.wordBreak = "break-all";
    document.getElementById('current_tabs').style.wordWrap = "break-word";
    document.getElementById('current_tabs').style.height = "auto";
    document.getElementById('image').src = currentTab.favIconUrl;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

function create_keyboard() {
    let canvas = document.getElementById("myCanvas")
    let ctx = canvas.getContext("2d")

    roundRect(ctx, 5, 5, 50, 50);
    // To change the color on the rectangle, just manipulate the context
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.fillStyle = "rgba(255, 255, 0, .5)";
}