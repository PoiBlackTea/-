chrome.runtime.onConnect.addListener(function (port) {
    if (port.name === "call SEED") {
        port.onMessage.addListener(function (message) {
            if (message.event === "create SEED") {
                var SEED_Promise = create_SEED(message.name);
            }
            SEED_Promise.then((message) => {
                port.postMessage({
                    content: message
                });
                port.disconnect();
            });
        });
    };
    if (port.name === "transform") {
        // B代表白色
        var array = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
        ];
        var password;
        port.onMessage.addListener(function (message) {
            if (message.event === "transform password") {
                var orignal_password = message.name;
                let mt = new MersenneTwister(message.SEED);
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(mt.rnd() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                var char = '~`!1@2#3$4%5^6&7*8(9)0_-+=QqWwEeRrTtYyUuIiOoPp{[}]|\\AaSsDdFfGgHhJjKkLl:;"\'ZzXxCcVvBbNnMm<,>.?/  '
                password = "";
                let r_obj = new MersenneTwister();
                var password_length = orignal_password.length;
                for (let i = 0; i < password_length; i++) {
                    color_indicator = array[char.indexOf(orignal_password[i])];
                    if (color_indicator === "B") {
                        let j = Math.floor(r_obj.rnd() * (11));
                        let ch_li = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A'];
                        color_indicator = ch_li[j];
                    }
                    password = ''.concat(password, color_indicator);
                }
            }
            port.postMessage({
                content: password
            });
            port.disconnect();
        });
    };
    if (port.name === "shuffle array") {
        var array = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        ];
        port.onMessage.addListener(function (message) {
            if (message.event === "shuffle array") {
                let mt = new MersenneTwister(message.SEED);
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(mt.rnd() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }
            port.postMessage({
                content: array
            });
            port.disconnect();
        });
    }
});

function create_SEED(name) {

    var formdata = new FormData();
    var MT_obj = new MersenneTwister();
    var client_random = MT_obj.int();
    formdata.append('username', name);
    formdata.append('client random', client_random);

    var result = fetch('http://127.0.0.1:8000/auth_system/Serv_Random/', {
            method: 'POST',
            body: formdata
        })
        .then(response => {
            if (response.status == 200) {
                return response.text()
            }
        }).then(server_random => {
            let bind = ''.concat(client_random, server_random);

            async function digestMessage(message) {
                const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
                const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
                const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
                return hashHex;
            }

            var digestHex = digestMessage(bind);
            var SEED = digestHex.then((response) => {
                let temp = response.slice(response.length - 10, response.length);
                return parseInt(String(BigInt(parseInt(temp, 16)) % 4294967296n));
            });

            return SEED
        }).catch((err) => {
            console.log('錯誤:', err);
        });
    return result
}

/* download from: https://github.com/pigulla/mersennetwister */

(function (root, factory) {
    'use strict';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.MersenneTwister = factory();
    }
}(this, function () {
    /**
     * A standalone, pure JavaScript implementation of the Mersenne Twister pseudo random number generator. Compatible
     * with Node.js, requirejs and browser environments. Packages are available for npm, Jam and Bower.
     *
     * @module MersenneTwister
     * @author Raphael Pigulla <pigulla@four66.com>
     * @license See the attached LICENSE file.
     * @version 0.2.3
     */

    /*
     * Most comments were stripped from the source. If needed you can still find them in the original C code:
     * http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/CODES/mt19937ar.c
     *
     * The original port to JavaScript, on which this file is based, was done by Sean McCullough. It can be found at:
     * https://gist.github.com/banksean/300494
     */
    'use strict';

    var MAX_INT = 4294967296.0,
        N = 624,
        M = 397,
        UPPER_MASK = 0x80000000,
        LOWER_MASK = 0x7fffffff,
        MATRIX_A = 0x9908b0df;

    /**
     * Instantiates a new Mersenne Twister.
     *
     * @constructor
     * @alias module:MersenneTwister
     * @since 0.1.0
     * @param {number=} seed The initial seed value.
     */
    var MersenneTwister = function (seed) {
        if (typeof seed === 'undefined') {
            seed = new Date().getTime();
        }

        this.mt = new Array(N);
        this.mti = N + 1;

        this.seed(seed);
    };

    /**
     * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
     *
     * @since 0.1.0
     * @param {number} seed The seed value.
     */
    MersenneTwister.prototype.seed = function (seed) {
        var s;

        this.mt[0] = seed >>> 0;

        for (this.mti = 1; this.mti < N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] =
                (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            this.mt[this.mti] >>>= 0;
        }
    };

    /**
     * Generates a random unsigned 32-bit integer.
     *
     * @since 0.1.0
     * @returns {number}
     */
    MersenneTwister.prototype.int = function () {
        var y,
            kk,
            mag01 = new Array(0, MATRIX_A);

        if (this.mti >= N) {
            if (this.mti === N + 1) {
                this.seed(5489);
            }

            for (kk = 0; kk < N - M; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
            }

            for (; kk < N - 1; kk++) {
                y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
                this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
            }

            y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
            this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
            this.mti = 0;
        }

        y = this.mt[this.mti++];

        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    };


    MersenneTwister.prototype.rnd = function () {
        return this.int() * (1.0 / MAX_INT);
    };

    return MersenneTwister;
}));