var rp = require('request-promise');
var url = 'https://twitchtracker.com/channels/live?page=300'
var currentPage = 300;
var currentHTML = "";
var streamerArray = [];
var doc;
console.log("start");
for(var i = currentPage; i < currentPage+2; i++) {
    url = url.substring(0,45) + i;
    console.log(url);
    rp(url)
        .then((html) => {
            console.log("msg");
            currentHTML = html;
            doc = new DOMParser().parseFromString(currentHTML, "text/xml");
        })
        .catch((err) => {
            console.log("err");
        });
    var rows = doc.getElementsByTagName("tbody")[0].rows;
    for(var i=0;i<rows.length;i++){
        var streamerInfo = {
            streamerName: "",
            totalHours: 0,
            averageViewers: 0,
            peakViewers: 0,
            hoursWatched: 0,
            followersGained: 0,
            followersPerHour: 0,
            viewsGained: 0,
            activeDays: 0
        }
        var td = rows[i].getElementsByTagName("td")[i];
        var currentViewers = td.getElementsByClassName("viewers-value");
        var streamer = td.getElementsByTagName("*")[3];
        streamerInfo.streamerName = streamer;
        var tturl = "https://twitchtracker.com/" + streamer;
        var streamerHTML = "";
        console.log("here");
        console.log(streamerInfo.streamerName);
        rp(tturl)
            .then(function(html) {
                streamerHTML = html;
            })
            .catch(function(err) {

            });
        
        var block = streamerHTML.getElementByClassName("g-x-s-block");
        for(var j = 0; j < block.length; j++) {
            var value = block.getElementsByTagName("*")[5];
            if(j == 0) {
                streamerInfo.totalHours = value;
            }else if(j == 1) {
                streamerInfo.averageViewers = value;
            }else if(j == 2) {
                streamerInfo.peakViewers = value;
            }else if(j == 3) {
                streamerInfo.hoursWatched = value;
            }else if(j == 4) {
                streamerInfo.followersGained = value;
            }else if(j == 5) {
                streamerInfo.followersPerHour = value;
            }else if(j == 6) {
                streamerInfo.viewsGained = value;
            }else {
                streamerInfo.activeDays = value;
            }
            }
            }
        }
