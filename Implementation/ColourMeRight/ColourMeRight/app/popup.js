//activate accordion
document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('accordion');
    link.addEventListener('mouseover', function () {
        activateAccordion();
    });
});

var activateAccordion = function () {
    $("#accordion").accordion({
        collapsible: true,
        heightStyle: 'content'
    });
}

var filters = ["none", "protanopia", "protanomaly", "deuteranopia", "deuteranomaly", "tritanopia", "tritanomaly", "achromatopsia", "achromatomaly"];
var currentFilterId = 0;

//apply colour filter
document.addEventListener('DOMContentLoaded', function () {
    var protanopia = document.getElementById('protanopia');
    protanopia.addEventListener('click', sendColorRequest);

    var protanomaly = document.getElementById('protanomaly');
    protanomaly.addEventListener('click', sendColorRequest);

    var deuteranopia = document.getElementById('deuteranopia');
    deuteranopia.addEventListener('click', sendColorRequest);

    var deuteranomaly = document.getElementById('deuteranomaly');
    deuteranomaly.addEventListener('click', sendColorRequest);

    var tritanopia = document.getElementById('tritanopia');
    tritanopia.addEventListener('click', sendColorRequest);

    var tritanomaly = document.getElementById('tritanomaly');
    tritanomaly.addEventListener('click', sendColorRequest);

    var achromatopsia = document.getElementById('achromatopsia');
    achromatopsia.addEventListener('click', sendColorRequest);

    var achromatomaly = document.getElementById('achromatomaly');
    achromatomaly.addEventListener('click', sendColorRequest);

    var none = document.getElementById('none');
    none.addEventListener('click', sendColorRequest);
});

function sendColorRequest(e) {
    var value;
    if (e.target.id !== "none") {
        value = e.target.id;
    } else {
        value = undefined;
    }
    for (var i in filters) {
        if (filters.hasOwnProperty(i)) {
            if (filters[i] == value) {
                currentFilterId = i;
                break;
            }
        }
    }
    sendFilterRequest(value);
}

function sendFilterRequest(value) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { value: value }, null);
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

//controller.loop({
//    hand: function (hand) {
//        if (hand.pinchStrength > 0) {
//            var pinchingFinger = findPinchingFingerType(hand);
//            console.log("the finger is " + pinchingFinger.type + "<br />");
//        }

//    }
//});

function isDirectionClockwise(circle, frame) {
    var clockwise = false;
    var pointableID = circle.pointableIds[0];
    var direction = frame.pointable(pointableID).direction;
    var dotProduct = Leap.vec3.dot(direction, circle.normal);

    if (dotProduct > 0) clockwise = true;
    return clockwise;

}

function updateCurrentFilterId(circle, frame) {
    if (isDirectionClockwise(circle, frame)) {
        currentFilterId = (currentFilterId + 1) % 9;
    } else {
        currentFilterId = (currentFilterId - 1) % 9;
    }
}

function findPinchingFingerType(hand) {
    var pincher;
    var closest = 500;
    for (var f = 1; f < 5; f++) {
        current = hand.fingers[f];
        var fingerIds = [hand.thumb, hand.indexFinger, hand.middleFinger, hand.ringFinger, hand.pinky];

        distance = Leap.vec3.distance(hand.thumb.tipPosition, current.tipPosition);
        if (current != hand.thumb && distance < closest) {
            closest = distance;
            pincher = current;
        }
    }
    return pincher;
}

controller.addStep(function (frame) {
    for (var g = 0; g < frame.gestures.length; g++) {
        var gesture = frame.gestures[g];
        controller.emit(gesture.type, gesture, frame);
    }
    return frame; // Return frame data unmodified
});

//controller.addStep(function(hand) {
//    if (hand.pinchStrength > 0 ) {
//        var pinchingFinger = findPinchingFingerType(hand);
//        console.log("the finger is " + pinchingFinger.type + "<br />");
//    }
//});

// Circle gesture event listener
controller.on('circle', function (circle, frame) {
    // Print its data when the state is start or stop
    if (circle.state == 'stop') {
        console.log(circle.state, circle.type, circle.id,
            'radius:', circle.radius);

        updateCurrentFilterId(circle, frame);
        sendFilterRequest(filters[currentFilterId]);
    }
});

controller.on('frame', function (frame) {
    frame.hands.forEach(function (hand) {
        if (hand.pinchStrength == 1 && hand.grabStrength !== 1) {
            var pinchingFinger = findPinchingFingerType(hand);
            console.log("the finger is " + pinchingFinger.type + "<br />");
        }
    });
});

// Start listening for frames
controller.connect();
