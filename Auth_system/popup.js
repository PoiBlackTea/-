document.addEventListener('DOMContentLoaded', () => {
    var mode_button = document.getElementById('Connect_button');
    mode_button.addEventListener('click', () => {
        if (document.getElementById('dropdown').value == '') {
            return;
        } else if (document.getElementById('dropdown').value == 'P_model') {
            var username = document.getElementById('username').value;
            document.getElementById('password_title').style.display = 'block';
            document.getElementById('myCanvas').style.display = 'none';
            document.getElementById('Auth_button').style.display = 'block';
        } else if (document.getElementById('dropdown').value == 'PC_model') {
            let username = document.getElementById('username').value;
            document.getElementById('password_title').style.display = 'none';
            document.getElementById('myCanvas').style.display = 'block';
            document.getElementById('Auth_button').style.display = 'block';
        }
        var port = chrome.runtime.connect({
            name: "call SEED.js"
        });
        port.postMessage({
            event: "create SEED",
            name: username
        });
        port.onMessage.addListener(function (response) {
            console.log(response);
        });

        var query = {
            active: true,
            currentWindow: true
        };
        chrome.tabs.query(query, get_current_URL);
    });

    /*
    var Auth_button = document.getElementById('Auth_button');
    Auth_button.addEventListener("click", test2);
    */

});

function test2() {
    console.log('auth')
    var formdata = new FormData();
    formdata.append('username', document.getElementById('username').value);
    formdata.append('P_password', document.getElementById('password').value);


    var result = fetch('http://127.0.0.1:8000/auth_system/P_model/', {
            method: 'POST',
            body: formdata
        })
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
        }).catch((err) => {
            console.log('錯誤:', err);
        });

    result.then(result => {
        /*
        let bind = ''.concat(client_random, result);
        let SEED = parseInt(SHA256(bind), 16) % Math.pow(10, 9);
        let vb = shuffle(shuffle_array, SEED);
        */
        console.log(result);
    })
}

function test() {



    var shuffle_array = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
    ];

    let vb = shuffle(shuffle_array, SEED);
    console.log(vb);
    create_keyboard();
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