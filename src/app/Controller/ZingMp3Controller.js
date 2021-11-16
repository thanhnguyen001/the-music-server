
const puppeteer = require('puppeteer');
const axios = require('axios');
const encodeApi = require('../../utils/encodeApi');
const encodeUrl = require('encodeurl');


const instanceAxios2 = axios.create({
    baseURL: "https://zingmp3.vn",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "*/*",
        // Cookie: process.env.MY_COOKIE_2,
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': 'https://zingmp3.vn',
        Host: 'zingmp3.vn',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.47",
        Referer: "https://zingmp3.vn/"
    }
});

const instanceAxios = axios.create({
    baseURL: "https://zingmp3.vn",
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "*/*",
        // Cookie: process.env.MY_COOKIE,
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        Host: 'zingmp3.vn',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.47",
        Referer: "https://zingmp3.vn/"
    }
});

const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
];


async function getCookie() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://zingmp3.vn");

    const cookies = await page.cookies();

    let ob = {};
    for (const i of cookies) {
        if (i.name === "zmp3_rqid") ob["zmp3_rqid"] = i.value;
        else if (i.name.includes("zmp3_app_version")) {
            ob["version"] = i.value;
            ob["version_key"] = i.name;
        }
    }

    await browser.close();

    return ob;
}
class ZingMp3 {

    // [POST] /api/artist/:alias
    async getArtistPlaylistSong(req, res, next) {
        let zmp3_rqid = "MHwxMTgdUngNzEdUngMTY2LjIyOHx2MS40LjJ8MTYzNDmUsICyMjEyOTIzMw";

        try {
            const { alias, id } = req.params;
            const { zmp3, version, q, typeSearch, page = 1 } = req.body;
            if (zmp3) zmp3_rqid = zmp3;
            const type = req.url.split("/")[1];
            // console.log(typeSearch, page)
            const ver = version && version.value ? version.value : process.env.VERSION;
            // const versionApi = ver.toString().split("").join(".");

            const name = alias;
            const { url, audioUrl } = await encodeApi({ q: encodeUrl(q), type, name, id, version: ver, typeSearch, page });
            let apiUrl = "";
            if (type === "song") apiUrl = audioUrl;
            else apiUrl = url;
            // console.log(apiUrl);
            let dt = null;

            if (type === "suggest") {
                instanceAxios2.defaults.headers = {};
                const { data } = await instanceAxios2.get(apiUrl);
                dt = { ...data, zmp3: zmp3_rqid, version: { key: version?.key || process.env.VERSION_KEY, value: version?.value || process.env.VERSION } };
                // console.log(response);
                res.json({ success: true, data: dt });
                return;
            }
            instanceAxios.defaults.headers.common["Cookie"] = `${process.env.VERSION_KEY}=${ver}; zmp3_rqid=${zmp3_rqid}`;

            let { data, headers } = await instanceAxios.get(apiUrl);
            
            if (data.err !== 0) {
                // const cookie = await getCookie();
                // instanceAxios.defaults.headers.common["Cookie"] = `${cookie.version_key}=${cookie.version}; zmp3_rqid=${cookie.zmp3_rqid}`;
                // zmp3_rqid = cookie.zmp3_rqid;
                // console.log(cookie);
                // let { data } = await instanceAxios.get(apiUrl);
                // dt = { ...data, zmp3: zmp3_rqid, version: { key: cookie.version_key, value: cookie.version } };
                // console.log("headers")
                if (headers["set-cookie"].length > 0) {
                    // console.log(zm[1]);
                    const zm = headers["set-cookie"][0]?.split(";")[0]?.split("=");
                    instanceAxios.defaults.headers.common["Cookie"] = `zmp3_rqid=${zm[1]}`;
                    zmp3_rqid = zm[1];
                    let { data } = await instanceAxios.get(apiUrl);
                    dt = { ...data, zmp3: zmp3_rqid, version: { key: process.env.VERSION_KEY, value: process.env.VERSION } };
                } 
            }
            else dt = { ...data, zmp3: zmp3_rqid, version: { key: version.key || process.env.VERSION_KEY, value: version.value || process.env.VERSION } }

            res.json({ success: true, data: dt })

        } catch (error) {
            res.json({ success: false, message: error.message })
        }
    }
};

module.exports = new ZingMp3;