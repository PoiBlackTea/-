document.addEventListener('DOMContentLoaded', async () => {
    var SEED;
    var username;
    var mode_button = await new Promise((resolve) => resolve(document.getElementById('Connect_button')));
    await mode_button.addEventListener('click', async () => {
        username = document.getElementById('username').value;
        // handle error
        if (document.getElementById('dropdown').value === '') {
            return;
        } else if (username === "") {
            return;
        }

        SEED = await new Promise((resolve) => {
            var port = chrome.runtime.connect({
                name: "call SEED"
            });
            port.postMessage({
                event: "create SEED",
                name: username
            });
            port.onMessage.addListener(function (response) {
                resolve(response['content']);
            });
        });

        if (document.getElementById('dropdown').value == 'P_model') {
            document.getElementById('password_title').style.display = 'block';
            document.getElementById('myCanvas').style.display = 'none';
            document.getElementById('PC_title').style.display = 'none';
        } else if (document.getElementById('dropdown').value == 'PC_model') {
            document.getElementById('password_title').style.display = 'none';
            document.getElementById('myCanvas').style.display = 'block';
            document.getElementById('PC_title').style.display = 'block';
            var port4 = chrome.runtime.connect({
                name: "shuffle array"
            });
            port4.postMessage({
                event: "shuffle array",
                SEED: SEED
            });
            port4.onMessage.addListener((response) => {
                create_keyboard(response['content']);
                create_button();
            });
        }
        document.getElementById('Auth_button').style.display = 'block';

        var query = {
            active: true,
            currentWindow: true
        };
        chrome.tabs.query(query, get_current_URL);
    });

    var Auth_button = await new Promise((resolve) => resolve(document.getElementById('Auth_button')));
    await Auth_button.addEventListener("click", async () => {

        if (document.getElementById('dropdown').value == 'P_model') {
            var transform_password = await transform(SEED);
            username = document.getElementById('username').value;
        }
        send_content(username, transform_password);
    });
});

function transform(SEED) {

    if (document.getElementById('dropdown').value == 'P_model') {
        return new Promise((resolve) => {
            var orignal_password = document.getElementById('password').value;
            var port2 = chrome.runtime.connect({
                name: "transform"
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
    //send username and password to content.js
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        var port3 = chrome.tabs.connect(tabs[0].id, {
            name: "padding password"
        });
        port3.postMessage({
            event: "padding password",
            username: username,
            password: transform_password
        });
        port3.onMessage.addListener((response) => {
            console.log(response);
        });
    })
}

function get_current_URL(tabs) {

    var currentTab = tabs[0];
    document.getElementById('url').innerHTML = currentTab.url;
    document.getElementById('current_tabs').style.width = "auto"
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

function create_keyboard(array) {

    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    canvas.height = 525;
    canvas.width = window.innerWidth;
    let row_offset = 57;
    let column_offset = 64;

    let color_li = [
        'LightPink', 'Red', 'Yellow', 'GreenYellow', 'DarkGreen', 'Cyan', 'Blue', 'SlateGray', 'DarkOrange', 'Black', 'Purple', 'Seashell'
    ]
    let char_str = '~`!1@2#3$4%5^6&7*8(9)0_-+=QqWwEeRrTtYyUuIiOoPp{[}]|\\AaSsDdFfGgHhJjKkLl:;"\'ZzXxCcVvBbNnMm<,>.?/'
    for (let i = 0; i < 47; i++) {
        if (i < 13) {
            create_key(1, i, char_str[2 * i], char_str[2 * i + 1], color_li[array[2 * i]], color_li[array[2 * i + 1]], 4.5);
        } else if (i < 26) {
            create_key(2, i - 13, char_str[2 * i], char_str[2 * i + 1], color_li[array[2 * i]], color_li[array[2 * i + 1]], 16.5);
        } else if (i < 37) {
            create_key(3, i - 26, char_str[2 * i], char_str[2 * i + 1], color_li[array[2 * i]], color_li[array[2 * i + 1]], 38.5);
        } else {
            create_key(4, i - 37, char_str[2 * i], char_str[2 * i + 1], color_li[array[2 * i]], color_li[array[2 * i + 1]], 54.5);
        }
    }
    /* create key */
    function create_key(row, column, upper_char, lower_char, upper_color, lower_color, x_offset) {

        roundRect(ctx, x_offset - 2.5 + row_offset * column, row * column_offset, 50, 50);
        ctx.rect(x_offset + row_offset * column, 2.5 + row * column_offset, 45, 45);
        ctx.stroke();
        ctx.beginPath()
        ctx.fillStyle = upper_color;
        ctx.rect(x_offset + row_offset * column, 2.5 + row * column_offset, 45, 10);
        ctx.fill();
        ctx.beginPath()
        ctx.fillStyle = lower_color;
        ctx.rect(x_offset + row_offset * column, 35.5 + row * column_offset, 45, 10);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.font = 'bold 15px Serial';
        ctx.fillText(upper_char, 18.5 + x_offset + row_offset * column, 22 + column_offset * row);
        ctx.fillText(lower_char, 18.5 + x_offset + row_offset * column, 34 + column_offset * row);
        ctx.textAlign = "center";

    }
    /* create SPCAE key */
    roundRect(ctx, 180, 0 + 5 * column_offset, 240, 35);
    ctx.rect(182.5, 2.5 + 5 * column_offset, 235, 30);
    ctx.stroke();
    ctx.beginPath()
    ctx.fillStyle = color_li[array[94]];
    ctx.rect(182.5, 2.5 + 5 * column_offset, 235, 6);
    ctx.fill();
    ctx.beginPath()
    ctx.fillStyle = color_li[array[95]];
    ctx.rect(182.5, 27.5 + 5 * column_offset, 235, 6);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = 'bold 15px Serial';
    ctx.fillText('SPACE', 300, 22 + column_offset * 5);
    ctx.textAlign = "center";

}

function create_button() {

    var circles = [];
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    circles.push({
        id: '0',
        radius: 95,
        sAngle: 1.5,
        eAngle: 1.9,
        color: 'LightPink'
    }, {
        id: '1',
        radius: 95,
        sAngle: 1.9,
        eAngle: 0.3,
        color: 'Red'
    }, {
        id: '2',
        radius: 95,
        sAngle: 0.3,
        eAngle: 0.7,
        color: 'Yellow'
    }, {
        id: '3',
        radius: 95,
        sAngle: 0.7,
        eAngle: 1.1,
        color: 'GreenYellow'
    }, {
        id: '4',
        radius: 95,
        sAngle: 1.1,
        eAngle: 1.5,
        color: 'DarkGreen'
    }, {
        id: '5',
        radius: 65,
        sAngle: 1.5,
        eAngle: 1.9,
        color: 'Cyan'
    }, {
        id: '6',
        radius: 65,
        sAngle: 1.9,
        eAngle: 0.3,
        color: 'Blue'
    }, {
        id: '7',
        radius: 65,
        sAngle: 0.3,
        eAngle: 0.7,
        color: 'SlateGray'
    }, {
        id: '8',
        radius: 65,
        sAngle: 0.7,
        eAngle: 1.1,
        color: 'DarkOrange'
    }, {
        id: '9',
        radius: 65,
        sAngle: 1.1,
        eAngle: 1.5,
        color: 'Black'
    }, {
        id: 'A',
        radius: 35,
        sAngle: 0,
        eAngle: 2,
        color: 'Purple'
    });
    var transform_password = "";
    canvas.addEventListener('click', (e) => {
        var pos = {
            x: e.pageX - canvas.offsetLeft,
            y: e.pageY - canvas.offsetTop
        };
        for (let circle of circles.reverse()) {
            if (isIntersect(pos, circle)) {
                transform_password = "".concat(transform_password, circle.id);
                document.getElementById("PC_password").value = transform_password;
                break;
            }
        }
    });
    document.getElementById('Auth_button').addEventListener("click", () => {
        send_content(document.getElementById('username').value, transform_password);
        transform_password = "";
    });

    circles.forEach((element) => {
        let x = 600,
            y = 420;
        ctx.beginPath();
        ctx.arc(x, y, element.radius, element.sAngle * Math.PI, element.eAngle * Math.PI);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = element.color;
        ctx.stroke();
        ctx.fill();
    });

}

function find_angle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * 180 / Math.PI;
}
/* this function calculate the coordinates */
function isIntersect(point, circle) {
    /* the circle origin coordinates */
    let origin = {
        x: 600,
        y: 420
    };
    let A = {
        x: 600,
        y: 325
    }
    /* 65 is second circle radius, 45 is inner circle radius*/
    if (circle.id == '0' || circle.id == '5') {
        if (Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) >= circle.radius)
            return false;
        else if (point.x < origin.x || point.y > origin.y)
            return false;
        else if (find_angle(A, origin, point) > 72)
            return false;
        else if (circle.id == '0' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 65)
            return false;
        else if (circle.id == '5' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 35)
            return false;
        else
            return true
    } else if (circle.id == '1' || circle.id == '6') {
        if (Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) >= circle.radius)
            return false;
        else if (point.x < origin.x)
            return false;
        else if (find_angle(A, origin, point) > 144 || find_angle(A, origin, point) < 72)
            return false;
        else if (circle.id == '1' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 65)
            return false;
        else if (circle.id == '6' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 35)
            return false;
        else
            return true
    } else if (circle.id == '2' || circle.id == '7') {
        if (Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) >= circle.radius)
            return false;
        else if (point.y < origin.y)
            return false;
        else if (find_angle(A, origin, point) < 144)
            return false;
        else if (circle.id == '2' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 65)
            return false;
        else if (circle.id == '7' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 35)
            return false;
        else
            return true
    } else if (circle.id == '3' || circle.id == '8') {
        if (Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) >= circle.radius)
            return false;
        else if (point.x > origin.x)
            return false;
        else if (find_angle(A, origin, point) > 144 || find_angle(A, origin, point) < 72)
            return false;
        else if (circle.id == '3' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 65)
            return false;
        else if (circle.id == '8' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 35)
            return false;
        else
            return true
    } else if (circle.id == '4' || circle.id == '9') {
        if (Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) >= circle.radius)
            return false;
        else if (point.x > origin.x || point.y > origin.y)
            return false;
        else if (find_angle(A, origin, point) > 72)
            return false;
        else if (circle.id == '4' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 65)
            return false;
        else if (circle.id == '9' && Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) <= 35)
            return false;
        else
            return true
    } else {
        return Math.sqrt((point.x - origin.x) ** 2 + (point.y - origin.y) ** 2) < circle.radius
    }
}