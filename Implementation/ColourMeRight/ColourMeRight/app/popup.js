/* Toggle between adding and removing the "active" and "show" classes when the user clicks on one of the "Section" buttons. The "active" class is used to add a background color to the current button when its belonging panel is open. The "show" class is used to open the specific accordion panel */
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].onclick = function () {
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}   

document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('accordion');
    link.addEventListener('mouseover', function () {
        activateAccordion();
    });
});


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
var activateAccordion = function () {
    $("#accordion").accordion({
        collapsible: true
    });
}