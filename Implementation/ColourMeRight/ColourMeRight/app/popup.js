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

var minions = {};

Leap.loop(function (frame) {

    frame.hands.forEach(function (hand, index) {

        var minion = (minions[index] || (minions[index] = new Minion()));
        minion.setTransform(hand.screenPosition(), hand.roll());
        minion.setVisibility("visible");
    });
    

}).use('screenPosition', { scale: 0.25 });


var Minion = function () {
    var minion = this;
    var img = document.createElement('img');
    img.src = 'http://1.bp.blogspot.com/-5CO7x9vuYqM/UioQcaLoCYI/AAAAAAAACjg/osbeeGf6Tig/s1600/minion_icon_image_picfishblogspotcom+%252810%2529.png';
    img.style.position = 'absolute';
    img.onload = function () {
        minion.setTransform([window.innerWidth / 2, window.innerHeight / 2], 0);
        document.body.appendChild(img);
    }

    minion.setVisibility = function(visibiity) {
        img.style.visibility = visibiity;
    };

    minion.setTransform = function (position, rotation) {

        img.style.left = position[0] - img.width / 2 + 'px';
        img.style.top = position[1] - img.height / 2 + 'px';

        img.style.transform = 'rotate(' + -rotation + 'rad)';

        img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
        img.style.OTransform = img.style.transform;

    };

};

minions[0] = new Minion();
minions[0].setVisibility("hidden");

// This allows us to move the minion even whilst in an iFrame.
Leap.loopController.setBackground(true);

