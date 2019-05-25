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
                  "</a><p class=\"history-time\">" +
                  time +
                  "</p></div>";
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

// Reposition Date-Time
$(window).resize(repositionDateTime);
repositionDateTime();
function repositionDateTime() {
  let newBottom = 100*$(window).height()/370-154;
  newBottom = newBottom>100? 100:newBottom;
  $(".date-time").css("bottom", newBottom+"px");
}

// Custom Links Hint
$(".hide-hint").click(function() {
  $(".hint").addClass("hidden");
});

// Switch Github-Gitlab
let isGithub = true;
let isGithubIssues = true;
let isGitlabIssues = true;

$(".switch-git").click(function() {
  isGithub = !isGithub;
  if(isGithub) {
    $(".git-history>.description").html("<i class=\"fab fa-github-alt\"></i>GITHUB ISSUES HISTORY");
    $(".switch-git").text("switch to gitlab");
    $(".pull-merge").html("<p>PULL REQUESTS</p><i class=\"pull-merge-caret pull-merge-caret-github hidden-caret fas fa-caret-up\">");
    trackCaret(isGithubIssues);
  } else {
    $(".git-history>.description").html("<i class=\"fab fa-gitlab\"></i>GITLAB ISSUES HISTORY");
    $(".switch-git").text("switch to github");
    $(".pull-merge").html("<p>MERGE REQUESTS</p><i class=\"pull-merge-caret pull-merge-caret-github hidden-caret fas fa-caret-up\">");
    trackCaret(isGitlabIssues);
  }
});

function trackCaret(isGitIssues) {
  if(isGitIssues) {
    $(".issues-caret").removeClass("hidden-caret");
    $(".pull-merge-caret").addClass("hidden-caret");
    if(isGithub) {
      parseJSON("JSON/github_issues.json", updateIssues);
    } else {
      parseJSON("JSON/gitlab_issues.json", updateIssues);
    }
  } else {
    $(".issues-caret").addClass("hidden-caret");
    $(".pull-merge-caret").removeClass("hidden-caret");
    if(isGithub) {
      parseJSON("JSON/github_pull_requests.json", updatePullMergeRequests);
    } else {
      parseJSON("JSON/gitlab_merge_requests.json", updatePullMergeRequests);
    }
  }
}

// Switch Issues - Pull-Merge-Requests
$(".issues").click(function() {
  if(isGithub) {
    isGithubIssues = true;
    parseJSON("JSON/github_issues.json", updateIssues);
  } else {
    isGitlabIssues = true;
    parseJSON("JSON/gitlab_issues.json", updateIssues);
  }
  $(".issues-caret").removeClass("hidden-caret");
  $(".pull-merge-caret").addClass("hidden-caret");
});
$(".pull-merge").click(function() {
  if(isGithub) {
    isGithubIssues = false;
    parseJSON("JSON/github_pull_requests.json", updatePullMergeRequests);
  } else {
    isGitlabIssues = false;
    parseJSON("JSON/gitlab_merge_requests.json", updatePullMergeRequests);
  }
  $(".issues-caret").addClass("hidden-caret");
  $(".pull-merge-caret").removeClass("hidden-caret");
});

// Initialize Git Issues
function updateIssues(json) {
  $("div").remove(".git-entry");
  let issues = json.issues;
  issues.forEach(function(issue) {
    const link = issue.link;
    const repo = issue.repo;
    const number = issue.number;
    const title = issue.title;
    const html = "<div class=\"git-entry content-font\"><a class=\"github-issue-link\" href=\"" +
                  link + "\"><p class=\"issue-repo\">Repo: " +
                  repo +
                 "</p><p class=\"issue-number\">Issue #" +
                  number +
                 "</p><p class=\"issue-title\">" +
                  title +
                 "</p></a></div>";
    $(".git-history").append(html);
  });
}
parseJSON("JSON/github_issues.json", updateIssues);


// Update Git Pull Request
function updatePullMergeRequests(json) {
  $("div").remove(".git-entry");
  let requests = json.requests;
  requests.forEach(function(request) {
    const link = request.link;
    const repo = request.repo;
    const number = request.number;
    const title = request.title;
    const html = "<div class=\"git-entry content-font\"><a class=\"github-request-link\" href=\"" +
                  link + "\"><p class=\"request-repo\">Repo: " +
                  repo +
                 "</p><p class=\"request-number\">" +
                 (isGithub? "Pull Request #" : "Merge Request !") +
                  number +
                 "</p><p class=\"request-title\">" +
                  title +
                 "</p></a></div>";
    $(".git-history").append(html);
  });
}
