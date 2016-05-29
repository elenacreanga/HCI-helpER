/* Toggle between adding and removing the "active" and "show" classes when the user clicks on one of the "Section" buttons. The "active" class is used to add a background color to the current button when its belonging panel is open. The "show" class is used to open the specific accordion panel */
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function () {
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}

var activateAccordion = function () {
    $("#accordion").accordion({
        collapsible: true
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('accordion');
    link.addEventListener('mouseover', function () {
        activateAccordion();
    });
});

//chrome.browserAction.onClicked.addListener(function (tab) {
//    activateAccordion();
//});

//chrome.webNavigation.onCompleted.addListener(function(details) {
//    chrome.tabs.executeScript(details.tabId, {
//        code: ' $("#accordion").accordion({' +
//              '     collapsible: true' +
//              ' });'
//    });
//});