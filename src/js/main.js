"use strict";
var url = "http://openhab.sybil.synyx.coffee/rest/items/";
//url = "http://localhost:8066/rest/items/"; // dev instance
var json = "?type=json";
var lightsOnCounter;

function loadStates() {
    var loadStatesJSON = new XMLHttpRequest();

    function loadStatesHandler() {
        var light,
            lightObject,
            lightItem,
            lights;

        if (loadStatesJSON.readyState === 4 && loadStatesJSON.status === 200) {
            lights = JSON.parse(loadStatesJSON.responseText).item;

            lightsOnCounter = 0;

            for (light in lights) {
                if (lights.hasOwnProperty(light)) {
                    lightObject = lights[light];
                    lightItem = document.getElementById(lightObject.name);
                    if (lightObject.state === "ON") {
                        lightItem.classList.remove("invisible");
                        lightsOnCounter++;
                    } else {
                        lightItem.classList.add("invisible");
                    }
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
    mainSwitch.addEventListener("click", switchAllLights, false);

    function LoadLightsHandler() {
        var light,
            lightObject,
            switchItem,
            switchName,
            lights;

        if (loadLightsJSON.readyState === 4 && loadLightsJSON.status === 200) {
            lights = JSON.parse(loadLightsJSON.responseText).item;

            for (light in lights) {
                if (lights.hasOwnProperty(light)) {
                    lightObject = lights[light];
                    switchName = lightObject.name.replace("light", "switch");

                    switchItem = document.getElementById(switchName);
                    switchItem.classList.remove("invisible");
                    switchItem.addEventListener("click", switchLight, false);

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

document.addEventListener("onload", loadInlineSVG(), false);

setInterval(function () {
    loadStates();
}, 15000);

function toggleLight(light) {
    var toggleLightJSON = new XMLHttpRequest();
    toggleLightJSON.responseType = "text"; // workaround for Firefox bug #884693
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
    toggleLight(light);
}

function getAllLights() {
    var children = document.body.getElementsByTagName("g"),
        elements = [],
        child;
    for (var i = 0, length = children.length; i < length; i++) {
        child = children[i];
        if (child.id.substr(0, 6) == "switch" && !child.classList.contains("invisible")) {
            elements.push(child);
        }
    }
    return elements;
}

function switchAllLights() {
    var lights,
        light,
        lightName,
        lightObject;
    lights = getAllLights();

    for (light in lights) {
        if (lights.hasOwnProperty(light)) {
            lightName = lights[light].id.replace("switch", "light");
            lightObject = document.getElementById(lightName);

            if (lightsOnCounter > 0 && !lightObject.classList.contains("invisible")) {
                toggleLight(lightObject);
            }

            if (lightsOnCounter === 0) {
                toggleLight(lightObject);
            }
        }
    }
}