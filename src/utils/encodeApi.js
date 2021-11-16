const crypto = require('crypto');

const getHash256 = (a) => {
    return crypto.createHash('sha256').update(a).digest('hex');
}
const getHmac512 = (str, key) => {
    let hmac = crypto.createHmac("sha512", key);
    return hmac.update(Buffer.from(str, 'utf8')).digest("hex");
}

const apiKey = "88265e23d4284f25963e6eedac8fbfa3";
const secretKey = "2aa2d1c561e809b267f3638c4a307aab";

// const apiKey1 = "38e8643fb0dc04e8d65b99994d3dafff";
// const secretKey1 = "10a01dcf33762d3a204cb96429918ff6";

const path = {
    artist: "/api/v2/page/get/artist",
    song: "/api/v2/song/get/info",
    lyrics: "/api/v2/lyric/get/lyric",
    "song-info": "/api/v2/song/get/info",
    playlist: "/api/v2/page/get/playlist",
    album: "/api/v2/page/get/playlist",
    audio: "/api/v2/song/get/streaming",
    home: "/api/v2/page/get/home",
    top100: "/api/v2/page/get/top-100",
    genre: "/api/v2/page/get/hub-home",
    "section-bottom": "/api/v2/playlist/get/section-bottom",
    newrelease: "/api/v2/page/get/newrelease-chart",
    multi: "/api/v2/search/multi",
    suggest: "/v1/web/suggestion-keywords",
    search: "/api/v2/search",
    recommend: "/api/v2/recommend/get/songs",
    counter: "/api/v2/search/getCounter",
    video: "/api/v2/page/get/video",

}

function encodeApi(query) {
    let ctime = Math.floor(Date.now() / 1000);
    let r = "";
    let url = "", sig = "", audioUrl = "";
    const { type, id, name, version, q, typeSearch, page = 1 } = query;

    switch (type) {
        case "playlist":
        case "album":
            r = getHash256(`ctime=${ctime}id=${id}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/page/get/playlist?id=${id}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "recommend":
            r = getHash256(`ctime=${ctime}id=${id}count=20version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/recommend/get/songs?id=${id}&start=0&count=20&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "counter":
            r = getHash256(`ctime=${ctime}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/search/getCounter?q=${q}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "suggest":
            r = getHash256(`ctime=${ctime}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://ac.zingmp3.vn/v1/web/suggestion-keywords?num=10&query=${q}&language=vi&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}/`;
            break;

        case "multi":
            r = getHash256(`ctime=${ctime}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/search/multi?q=${q}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "search":
            r = getHash256(`count=18ctime=${ctime}page=${page}type=${typeSearch}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/search?q=${q}&type=${typeSearch}&page=${page}&count=18&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "artist":
            r = getHash256(`ctime=${ctime}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/page/get/artist?alias=${name}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "lyrics":
            r = getHash256(`ctime=${ctime}id=${id}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/lyric/get/lyric?id=${id}&BGId=0&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "song":
        case "song-info":
            r = getHash256(`ctime=${ctime}id=${id}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/song/get/info?id=${id}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;

            const audioSig = getHmac512(path.audio + r, secretKey);
            audioUrl = `https://zingmp3.vn/api/v2/song/get/streaming?id=${id}&ctime=${ctime}&version=${version}&sig=${audioSig}&apiKey=${apiKey}`
            break;

        case "video":
            r = getHash256(`ctime=${ctime}id=${id}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/page/get/video?id=${id}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "top100":
            r = getHash256(`ctime=${ctime}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/page/get/top-100?ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "genre":
            r = getHash256(`ctime=${ctime}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/page/get/hub-home?ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "section-bottom":
            r = getHash256(`ctime=${ctime}id=${id}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/playlist/get/section-bottom?id=${id}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        case "newrelease":
            r = getHash256(`ctime=${ctime}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/page/get/newrelease-chart?ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

        default:
            r = getHash256(`ctime=${ctime}page=${page}version=${version}`);
            sig = getHmac512(path[type] + r, secretKey);
            url = `https://zingmp3.vn/api/v2/page/get/home?page=${page}&ctime=${ctime}&version=${version}&sig=${sig}&apiKey=${apiKey}`;
            break;

    }
    
    return { url, audioUrl };
}

module.exports = encodeApi;
