"use strict"; // NOSONAR This might be unreliable in old browsers. We don't care about those!
var url = "http://openhab.sybil.synyx.coffee/rest/items/";
//url = "http://localhost:8066/rest/items/"; // dev instance
var json = "?type=json";
var lightsOnCounter;

function loadStates() {
    var loadStatesJSON = new XMLHttpRequest();

    function loadStatesHandler() {
        var light,
            lightElement,
            lights;

        if (loadStatesJSON.readyState === 4 && loadStatesJSON.status === 200) {
            lights = JSON.parse(loadStatesJSON.responseText).item;

            lightsOnCounter = 0;

            for (var i = 0; i < lights.length; i++) {
                light = lights[i];
                lightElement = document.getElementById(light.name);
                if (lightElement === null) {
                    continue;
                }
                if (light.state === "ON") {
                    lightElement.classList.remove("invisible");
                    lightsOnCounter++;
                } else {
                    lightElement.classList.add("invisible");
                }
            }
        }
    }

    if (loadStatesJSON !==  null) {
        loadStatesJSON.open("GET", url + json, true);
        loadStatesJSON.onreadystatechange = loadStatesHandler;
        loadStatesJSON.send();
    }
}

function loadLights() {
    var loadLightsJSON = new XMLHttpRequest();

    var mainSwitch = document.getElementById("mainswitch");
    if (mainSwitch !== null) {
        mainSwitch.addEventListener("click", switchAllLights, false);
    }

    function LoadLightsHandler() {
        var light,
            switchElement,
            switchName,
            lights;

        if (loadLightsJSON.readyState === 4 && loadLightsJSON.status === 200) {
            lights = JSON.parse(loadLightsJSON.responseText).item;

            for (var i = 0; i < lights.length; i++) {
                light = lights[i];
                switchName = light.name.replace("light", "switch");

                switchElement = document.getElementById(switchName);
                if (switchElement !== null) {
                    switchElement.classList.remove("invisible");
                    switchElement.addEventListener("click", switchLight, false);
                }
            }
            loadStates();
        }
    }

    if (loadLightsJSON !==  null) {
        loadLightsJSON.open("GET", url + json, true);
        loadLightsJSON.onreadystatechange = LoadLightsHandler;
        loadLightsJSON.send();
    }
}

function loadInlineSVG() {
    var loadSVG = new XMLHttpRequest();

    function handler() {
        if (loadSVG.readyState === 4 && loadSVG.status === 200) {
            var svg = document.getElementById("svg");
            svg.innerHTML = loadSVG.responseText;
            loadLights();
        }
    }

    if (loadSVG !==  null) {
        loadSVG.open("GET", "img/office_lights.svg", true);
        loadSVG.onreadystatechange = handler;
        loadSVG.send();
    }
}

function toggleLight(light) {
    var toggleLightJSON = new XMLHttpRequest();
    // workaround for Firefox bug #884693
    toggleLightJSON.responseType = "text";
    toggleLightJSON.open("POST", url + light.id, true);

    function turnOnHandler() {
        if (toggleLightJSON.readyState === 4 && toggleLightJSON.status === 201) {
            light.classList.remove("invisible");
            lightsOnCounter++;
        }
    }

    function turnOffHandler() {
        if (toggleLightJSON.readyState === 4 && toggleLightJSON.status === 201) {
            light.classList.add("invisible");
            lightsOnCounter--;
        }
    }

    if (light.classList.contains("invisible")) {
        if (toggleLightJSON !==  null) {
            toggleLightJSON.onreadystatechange = turnOnHandler;
            toggleLightJSON.send("ON");
        }
    } else {
        if (toggleLightJSON !==  null) {
            toggleLightJSON.onreadystatechange = turnOffHandler;
            toggleLightJSON.send("OFF");
        }
    }
}

function switchLight(event) {
    var lightName = "light" + event.target.id,
        light = document.getElementById(lightName);

    if (light !== null) {
        toggleLight(light);
    }
}

function getAllLights() {
    var children = document.body.getElementsByTagName("g"),
        elements = [],
        child;
    for (var i = 0; i < children.length; i++) {
        child = children[i];
        if (child.id.substr(0, 6) === "switch" && !child.classList.contains("invisible")) {
            elements.push(child);
        }
    }
    return elements;
}

function switchAllLights() {
    var lights = getAllLights(),
        lightName,
        lightElement;

    function switchLightOn(element) {
        if (element !== null && element.classList.contains("invisible")) {
            toggleLight(element);
        }
    }

    function switchLightOff(element) {
        if (element !== null && !element.classList.contains("invisible")) {
            toggleLight(element);
        }
    }

    if (lightsOnCounter === 0) {
        for (var i = 0; i < lights.length; i++) {
            lightName = lights[i].id.replace("switch", "light");
            lightElement = document.getElementById(lightName);
            switchLightOn(lightElement);
        }
    } else {
        for (var j = 0; j < lights.length; j++) {
            lightName = lights[j].id.replace("switch", "light");
            lightElement = document.getElementById(lightName);
            switchLightOff(lightElement);
        }
    }
}

window.addEventListener("load", loadInlineSVG, false);

setInterval(function () {
    loadStates();
}, 15000);
