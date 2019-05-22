// jshint esversion: 6

// Initab logo animation
$(".initab-logo").hover(function() {
  $(".initab-logo").attr("src", "images/initab_logo_hover.svg");
}, function() {
  $(".initab-logo").attr("src", "images/initab_logo.svg");
});

// Read file
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
parseJSON("JSON/reddit_feed.json", updateRedditFeeds);

function updateRedditFeeds(json) {
  let feeds = json.feeds;
  feeds.forEach(function(feed) {
    const title = feed.title;
    const author = feed.postBy;
    const score = feed.score;
    const link = feed.link;
    const comment = feed.comment;
    const html = "<a class=\"reddit-feed\" href=\"" +
                  link + "\"><p class=\"feed-title\">" +
                  title +
                 "</p><p class=\"feed-author\">Posted by: " +
                  author +
                 "</p><p class=\"feed-score\">Reddit Score: " +
                  score +
                 "</p>" +
                 (comment.length == 0?
                  "</a>":
                  "<a class=\"feed-comments\" href=\"" + comment +"\">Link to Comments</a></a>");
    console.log(html);
    $(".left").append(html);

  });
  $(".feed-title").addClass("feed-title-style");
}
