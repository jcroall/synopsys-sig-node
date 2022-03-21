"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverityCreateIssueCommentMessage = exports.coverityCreateReviewCommentMessage = exports.coverityCreateNoLongerPresentMessage = exports.coverityIsPresent = void 0;
var github_utils_1 = require("./github-utils");
var coverity_constants_1 = require("./coverity-constants");
function coverityIsPresent(existingMessage) {
    var lines = existingMessage.split('\n');
    return lines.length > 3 && lines[2] !== coverity_constants_1.NOT_PRESENT;
}
exports.coverityIsPresent = coverityIsPresent;
function coverityCreateNoLongerPresentMessage(existingMessage) {
    var existingMessageLines = existingMessage.split('\n');
    return "".concat(existingMessageLines[0], "\n").concat(existingMessageLines[1], "\n").concat(coverity_constants_1.NOT_PRESENT, "\n-->\n\nCoverity issue no longer present as of: ").concat(process.env.GITHUB_SHA, "\n<details>\n<summary>Show issue</summary>\n\n").concat(existingMessageLines.slice(4).join('\n'), "\n</details>");
}
exports.coverityCreateNoLongerPresentMessage = coverityCreateNoLongerPresentMessage;
function coverityCreateReviewCommentMessage(issue) {
    var issueName = issue.checkerProperties ? issue.checkerProperties.subcategoryShortDescription : issue.checkerName;
    var checkerNameString = issue.checkerProperties ? "\r\n_".concat(issue.checkerName, "_") : '';
    var impactString = issue.checkerProperties ? issue.checkerProperties.impact : 'Unknown';
    var cweString = issue.checkerProperties ? ", CWE-".concat(issue.checkerProperties.cweCategory) : '';
    var mainEvent = issue.events.find(function (event) { return event.main === true; });
    var mainEventDescription = mainEvent ? mainEvent.eventDescription : '';
    var remediationEvent = issue.events.find(function (event) { return event.remediation === true; });
    var remediationString = remediationEvent ? "## How to fix\r\n ".concat(remediationEvent.eventDescription) : '';
    return "".concat(coverity_constants_1.COMMENT_PREFACE, "\n").concat(issue.mergeKey, "\n").concat(coverity_constants_1.PRESENT, "\n-->\n\n# Coverity Issue - ").concat(issueName, "\n").concat(mainEventDescription, "\n\n_").concat(impactString, " Impact").concat(cweString, "_").concat(checkerNameString, "\n\n").concat(remediationString, "\n");
}
exports.coverityCreateReviewCommentMessage = coverityCreateReviewCommentMessage;
function coverityCreateIssueCommentMessage(issue) {
    var message = coverityCreateReviewCommentMessage(issue);
    var relativePath = (0, github_utils_1.githubRelativizePath)(issue.mainEventFilePathname);
    return "".concat(message, "\n## Issue location\nThis issue was discovered outside the diff for this Pull Request. You can find it at:\n[").concat(relativePath, ":").concat(issue.mainEventLineNumber, "](").concat(process.env.GITHUB_SERVER_URL, "/").concat(process.env.GITHUB_REPOSITORY, "/blob/").concat(process.env.GITHUB_SHA, "/").concat(relativePath, "#L").concat(issue.mainEventLineNumber, ")\n");
}
exports.coverityCreateIssueCommentMessage = coverityCreateIssueCommentMessage;
