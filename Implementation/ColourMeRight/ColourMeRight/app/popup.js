//activate accordion
document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('accordion');
    link.addEventListener('mouseover', function () {
        activateAccordion();
    });
});

var activateAccordion = function () {
    $("#accordion").accordion({
        collapsible: true
    });
}

//apply colour filter
document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('button');
    link.addEventListener('click', function () {
        executeScript();
    });
});

var executeScript = function () {
    chrome.tabs.executeScript({
        file: 'colourFilter.js'
    });
}

//change page colour
var colours = [
    {
        colour: "darkGrey",
        hex: "#151515"
    },
    {
        colour: "purple",
        hex: "#886677"
    },
    {
        colour: "beige",
        hex: "#f5f1de"
    },
    {
        colour: "black",
        hex: "#000000"
    }
];

function click(e) {
    var filteredColours = colours.filter(function(x) {
        return x.colour === e.target.id;
    });
    chrome.tabs.executeScript(null,
        { code: "document.body.style.backgroundColor='" + filteredColours[0].hex + "'" });
    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    var divs = document.querySelectorAll('.backgroundColour');
    for (var i = 0; i < divs.length; i++) {
        divs[i].addEventListener('click', click);
    }
});

////change text colour
//var colours2 = [
//    {
//        colour: "white",
//        hex: "#ffffff"
//    },
//    {
//        colour: "red",
//        hex: "#886677"
//    },
//    {
//        colour: "blue",
//        hex: "#f5f1de"
//    }
//];

//function click2(e) {
//    var filteredColours = colours2.filter(function (x) {
//        return x.colour === e.target.id;
//    });
//    chrome.tabs.executeScript(null,
//        { code: "document.body.style.text='" + filteredColours[0].hex + "'" });
//    window.close();
//}

//document.addEventListener('DOMContentLoaded', function () {
//    var divs = document.querySelectorAll('.textColour');
//    for (var i = 0; i < divs.length; i++) {
//        divs[i].addEventListener('click', click2);
//    }
//});


//Leap Motion
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
