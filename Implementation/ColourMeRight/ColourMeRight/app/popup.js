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

//change theme
var themes = [
    {
        name: "theme1",  
        backgroundColour: "#121212",
        textColour: "#B2B2B2"
    },
    {
        name: "theme2",
        backgroundColour: "#525252",
        textColour: "#FEFEFE"
    },
    {
        name: "theme3",
        backgroundColour: "#F9F1E4",
        textColour: "#542D1E"
    },
    {
        name: "theme4",
        backgroundColour: "#FBFBFB",
        textColour: "#111111"
    }
];

function changeTheme(e) {
    var filteredThemes = themes.filter(function (x) {
        return x.name === e.target.id;
    });
    chrome.tabs.executeScript(null,
        { code: "document.body.style.backgroundColor='" + filteredThemes[0].backgroundColour + "'; document.body.style.color='" + +filteredThemes[0].textColour + "'"});
    window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    var divs = document.querySelectorAll('.theme');
    for (var i = 0; i < divs.length; i++) {
        divs[i].addEventListener('click', changeTheme);
    }
});

//Leap Motion
var minions = {};

//Leap.loop(function (frame) {

//    frame.hands.forEach(function (hand, index) {

//        var minion = (minions[index] || (minions[index] = new Minion()));
//        minion.setTransform(hand.screenPosition(), hand.roll());
//        minion.setVisibility("visible");
//    });
    

//}).use('screenPosition', { scale: 0.25 });


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
//Leap.loopController.setBackground(true);



var controller = new Leap.Controller({ enableGestures: true });

controller.addStep(function (frame) {
    for (var g = 0; g < frame.gestures.length; g++) {
        var gesture = frame.gestures[g];
        controller.emit(gesture.type, gesture, frame);
    }
    return frame; // Return frame data unmodified
});

// Circle gesture event listener
controller.on('circle', function (circle, frame) {
    executeScript();
    // Print its data when the state is start or stop
    if (circle.state == 'start' || circle.state == 'stop') {
        console.log(circle.state, circle.type, circle.id,
                    'radius:', circle.radius);
    }
});

// Start listening for frames
controller.connect();
