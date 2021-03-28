const axios = require('axios');
const cheerio = require('cheerio');


var priority = [];
var names = [];

const getStreamerInfo = async() => {
    try {
        var pageNumber = 200 + Math.floor((Math.random() * 200));
        console.log(pageNumber + " pg");
        //const { data } = await axios.get('https://twitchtracker.com/channels/live');
        const { data } = await axios.get('https://twitchtracker.com/channels/live?page=' + pageNumber);
        const $ = cheerio.load(data);
        var rows = $("tbody").find("tr");
        
        for(var i = 0; rows.length; i++) {
            var streamerInfo = {
                streamerName: "",
                currentViewers: 0,
                followersPerStream: 0,
                activeDays: 0,
            }
            var current = rows[i];
            streamerInfo.streamerName = $(current).children("td:nth-child(3)").children("a").text();
            streamerInfo.currentViewers = parseInt($(current).children("td:nth-child(5)").children("span").text());
            var newurl = 'https://twitchtracker.com/';
            newurl = encodeURI(newurl.concat(streamerInfo.streamerName));
            const { data } = await axios.get('https://twitchtracker.com/' + streamerInfo.streamerName);
            const a = cheerio.load(data);
            var value = a('.text-right');
            streamerInfo.activeDays = a(value[4]).text();
            streamerInfo.followersPerStream = a(value[2]).text();

            names.push(streamerInfo.streamerName);
            var d = streamerInfo.activeDays;
            var f = parseInt(streamerInfo.followersPerStream);
            var v = parseInt(streamerInfo.currentViewers);
            if(isNaN(v)) {
                break;
            }
            var points = 1;
            if(v < 15) {
                points *= 3;
            }else if(v < 25) {
                points *= 4;
            }else if(v < 50) {
                points *=2;
            }
            if(f < 3) {
                points *= 3;
            }else if(f < 10) {
                points *= 7;
            }else if(f >= 10) {
                points *= 1;
            }
            var aa = parseFloat(d.split(' / ')[0]);
            var b = parseInt(d.split(' / ')[1]);
            if(aa * 2 < b) {
                points *= 0;
            }else {
                points = points * (aa / b);
            }
            priority.push(points);

            console.log(streamerInfo.streamerName);
            console.log(streamerInfo.currentViewers);
            console.log(streamerInfo.followersPerStream);
            console.log(streamerInfo.activeDays);
            console.log("POINTS " + points);
        }
        return names[getHigh()];
    } catch(error) {
        return names[getHigh()];
    }
};
getStreamerInfo();

function getHigh() {
    var high = priority[0];
    var index = 0;
    for(var i = 0; i < priority.length; i++) {
        if(priority[i] > high) {
            high = priority[i];
            index = i;
    }
}
return index;
}
function perform() {
    return getStreamerInfo();
}
