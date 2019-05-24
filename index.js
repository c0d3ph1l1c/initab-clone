// jshint esversion: 6

// Initab logo animation
$(".initab-logo").hover(function() {
  $(".initab-logo").attr("src", "images/initab_logo_hover.svg");
}, function() {
  $(".initab-logo").attr("src", "images/initab_logo.svg");
});

// JSON parser
function parseJSON(file, callback) {
    const f = new XMLHttpRequest();
    f.open("GET", file, true);
    f.onreadystatechange = function () {
        if(f.readyState === 4) {
            if(f.status === 200 || f.status == 0) {
                callback(JSON.parse(f.responseText));
            }
        }
    };
    f.send(null);
}

// Update Reddit News Feed
function updateRedditFeeds(json) {
  let feeds = json.feeds;
  feeds.forEach(function(feed) {
    const title = feed.title;
    const author = feed.postBy;
    const score = feed.score;
    const link = feed.link;
    const comment = feed.comment;
    const html = "<div class=\"reddit-feed content-font\"><a class=\"feed-link\" href=\"" +
                  link + "\"><p class=\"feed-title\">" +
                  title +
                 "</p><p><span class=\"posted-by\">Posted by: </span>" +
                 "<span class=\"feed-author\">" +
                  author +
                 "</span></p><p class=\"feed-score\">Reddit Score: " +
                  score +
                 "</p>" +
                 (comment.length == 0?
                  "</a></div>":
                  "</a><a class=\"feed-comments\" href=\"" + comment +"\">Link to Comments</a></div>");
    $(".left").append(html);
  });
}
parseJSON("JSON/reddit_feed.json", updateRedditFeeds);

// Update Javascript History
function updateJSHistory(json) {
  let histories = json.history;
  histories.forEach(function(history) {
    const link = history.link;
    const favicon = history.favicon;
    const title = history.title;
    const time = history.time;
    const html = "<div class=\"js-history content-font\"><a class=\"history-link\" href=\"" +
                  link +
                  "\"><img class=\"history-favicon\" src=\"" +
                  favicon +
                  "\">" +
                  title +
                  "</a><span class=\"history-time\">" +
                  time +
                  "</span></div>";
    $(".javascript-history").append(html);
  });
}
parseJSON("JSON/js_history.json", updateJSHistory);

// Update Date-Time
function updateDateTime() {
  const now = new Date();
  $(".hour").text(now.getHours()>12?
                    now.getHours()-12 :
                    (now.getHours() === 0? 12: now.getHours()));
  $(".minute").text(String(now.getMinutes()).length === 1?
                      "0"+now.getMinutes() :
                      now.getMinutes());
  $(".am-pm").text(now.getHours()<12? "AM" : "PM");
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  $(".month").text(months[now.getMonth()]);
  $(".day").text(now.getDate());
  $(".year").text(now.getYear()+1900);
  setTimeout(updateDateTime, 500);
}
updateDateTime();

// Custom Links Hint
$(".hide-hint").click(function() {
  $(".hint").addClass("hidden");
});
