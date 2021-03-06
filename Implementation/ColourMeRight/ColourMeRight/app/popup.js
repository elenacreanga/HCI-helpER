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
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { value: value }, null);
        }
    });
}

//change theme
var themes = [
    {
        id : 0,
        name: "theme1",  
        backgroundColour: "#121212",
        textColour: "#B2B2B2"
    },
    {
        id: 1,
        name: "theme2",
        backgroundColour: "#525252",
        textColour: "#FEFEFE"
    },
    {
        id: 2,
        name: "theme3",
        backgroundColour: "#F9F1E4",
        textColour: "#542D1E"
    },
    {
        id: 3,
        name: "theme4",
        backgroundColour: "#FBFBFB",
        textColour: "#111111"
    }
];

var currentThemeId = 3;

function applyTheme() {
    chrome.tabs.executeScript(null,
        {
            code: "document.body.style.backgroundColor='" + themes[currentThemeId].backgroundColour
              + "'; \n document.body.style.color='" + themes[currentThemeId].textColour
              + "'; \n  " +
                "document.body.style.lineHeight='1.75em'; \n " +
                "var paragraphs = document.getElementsByTagName('p'); for (var i in paragraphs) { \n " +
                "if(paragraphs[i] !== undefined && paragraphs[i].style !== undefined) { \n " +
                "if(paragraphs[i].parentElement !== undefined) { \n " +
                "paragraphs[i].parentElement.style.backgroundColor='" + themes[currentThemeId].backgroundColour + "';  \n " +
                "if(paragraphs[i].parentElement.parentElement !== undefined) { \n " +
                "paragraphs[i].parentElement.parentElement.style.backgroundColor='" + themes[currentThemeId].backgroundColour + "'; } }\n "
              + "paragraphs[i].style.color='" + themes[currentThemeId].textColour + "'; \n " +
                "paragraphs[i].style.fontSize='16px'; } } \n " +
                "var h1s = document.getElementsByTagName('h1');  \n " +
                "for (var i in h1s) { \n " +
                "if(h1s[i] !== undefined && h1s[i].style !== undefined) { \n " +
                "h1s[i].style.backgroundColor='" + themes[currentThemeId].backgroundColour + "'; \n " +
                "h1s[i].style.color='" + themes[currentThemeId].textColour + "'; \n " +
                "h1s[i].style.fontSize='30px'; \n " +
                "h1s[i].style.lineHeight='34px' \n " +
                "} }" +
                "var h2s = document.getElementsByTagName('h2');  \n " +
                "for (var i in h2s) { \n " +
                "if(h2s[i] !== undefined && h2s[i].style !== undefined) { \n " +
                "h2s[i].style.backgroundColor='" + themes[currentThemeId].backgroundColour + "'; \n " +
                "h2s[i].style.color='" + themes[currentThemeId].textColour + "'; \n " +
                "h2s[i].style.fontSize='20px'; \n " +
                "h2s[i].style.lineHeight='25px' \n " +
                "} }"
        });
}

function changeTheme(e) {
    var filteredThemes = themes.filter(function (x) {
        return x.name === e.target.id;
    });
    currentThemeId = filteredThemes[0].id;
    applyTheme();
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

function isSwipeRight(swipe) {
    var isRight = true;
    var dir = swipe.direction;
    var dirStr = dir[0] > 0.8 ? 'right' : dir[0] < -0.8 ? 'left'
                    : dir[1] > 0.8 ? 'up' : dir[1] < -0.8 ? 'down'
                    : dir[2] > 0.8 ? 'backward' : 'forward';
    if (dir[0] < -0.8) {
        isRight = false;
    }
    return isRight;

}

function updateCurrentThemeId(swipe) {
    if (isSwipeRight(swipe)) {
        currentThemeId = (currentThemeId + 1) % 4;
    } else {
        currentThemeId = (currentThemeId - 1) % 4;
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
    if (swipe.state == 'stop') {
        var dir = swipe.direction;
        var dirStr = dir[0] > 0.8 ? 'right' : dir[0] < -0.8 ? 'left'
                   : dir[1] > 0.8 ? 'up' : dir[1] < -0.8 ? 'down'
                   : dir[2] > 0.8 ? 'backward' : 'forward';
        console.log(swipe.state, swipe.type, swipe.id, dirStr,
                    'direction:', dir);
        updateCurrentThemeId(swipe);
        applyTheme();
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
