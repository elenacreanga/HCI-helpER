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

var currentThemeId = 0;

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
var controller = new Leap.Controller({ enableGestures: true });

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

controller.on('swipe', function (swipe, frame) {
    // Print its data when the state is start or stop
    if (swipe.state == 'start' || swipe.state == 'stop') {
        var dir = swipe.direction;
        var dirStr = dir[0] > 0.8 ? 'right' : dir[0] < -0.8 ? 'left'
                   : dir[1] > 0.8 ? 'up' : dir[1] < -0.8 ? 'down'
                   : dir[2] > 0.8 ? 'backward' : 'forward';
        console.log(swipe.state, swipe.type, swipe.id, dirStr,
                    'direction:', dir);
    }
});

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
