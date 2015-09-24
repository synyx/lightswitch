describe("Testing light switches", function(){
    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it("switchAllLights when ALL lights are OFF, turns all lights on", function() {
        var lightSwitches = [
            {"id": "switch05"}, // this switch has no light associated with it, it should be ignored
            {"id": "switch04"},
            {"id": "switch02"},
            {"id": "switch01"}
            ],
            lights = [
                {"id": "light01", "classList": { "contains": function(css) { return css === "invisible"; }}},
                {"id": "light02", "classList": { "contains": function(css) { return css === "invisible"; }}},
                {"id": "light03", "classList": { "contains": function(css) { return css === "invisible"; }}},  // this light has no switch associated with it, it should be ignored
                {"id": "light04", "classList": { "contains": function(css) { return css === "invisible"; }}}
            ];

        window.lightsOnCounter = 0;

        spyOn(window, "toggleLight").and.callFake(function() { window.lightsOnCounter++; });
        spyOn(window, "getAllLights").and.returnValue(lightSwitches);
        spyOn(document, "getElementById").and.callFake(function(element) {
            switch (element) {
                case "light01":
                    return lights[0];
                case "light02":
                    return lights[1];
                case "light03":
                    return lights[2];
                case "light04":
                    return lights[3];
                default:
                    return null;
            }
        });

        window.switchAllLights();

        expect(window.toggleLight).toHaveBeenCalledWith(lights[0]);
        expect(window.toggleLight).toHaveBeenCalledWith(lights[1]);
        expect(window.toggleLight).toHaveBeenCalledWith(lights[3]);
        expect(window.toggleLight.calls.count()).toBe(3);
    });

    it("switchAllLights when ALL lights are ON, turns all lights off", function() {
        var lightSwitches = [
            {"id": "switch05"}, // this switch has no light associated with it, it should be ignored
            {"id": "switch04"},
            {"id": "switch02"},
            {"id": "switch01"}
            ],
            lights = [
                {"id": "light01", "classList": { "contains": function() { return false; }}},
                {"id": "light02", "classList": { "contains": function() { return false; }}},
                {"id": "light03", "classList": { "contains": function() { return false; }}},  // this light has no switch associated with it, it should be ignored
                {"id": "light04", "classList": { "contains": function() { return false; }}}
            ];

        window.lightsOnCounter = 3;

        spyOn(window, "toggleLight").and.callFake(function() { window.lightsOnCounter--; });
        spyOn(window, "getAllLights").and.returnValue(lightSwitches);
        spyOn(document, "getElementById").and.callFake(function(element) {
            switch (element) {
                case "light01":
                    return lights[0];
                case "light02":
                    return lights[1];
                case "light03":
                    return lights[2];
                case "light04":
                    return lights[3];
                default:
                    return null;
            }
        });

        window.switchAllLights();

        expect(window.toggleLight).toHaveBeenCalledWith(lights[0]);
        expect(window.toggleLight).toHaveBeenCalledWith(lights[1]);
        expect(window.toggleLight).toHaveBeenCalledWith(lights[3]);
        expect(window.toggleLight.calls.count()).toBe(3);
    });

    it("switchAllLights when SOME lights are ON, turns all lights off", function() {
        var lightSwitches = [
            {"id": "switch04"},
            {"id": "switch02"},
            {"id": "switch01"}
            ],
            lights = [
                {"id": "light01", "classList": { "contains": function(css) { return css === "invisible"; }}},
                {"id": "light02", "classList": { "contains": function() { return false; }}},
                {"id": "light03", "classList": { "contains": function(css) { return css === "invisible"; }}},  // this light has no switch associated with it, it should be ignored
                {"id": "light04", "classList": { "contains": function(css) { return css === "invisible"; }}}
            ];

        window.lightsOnCounter = 1;

        spyOn(window, "toggleLight").and.callFake(function() { window.lightsOnCounter--; });
        spyOn(window, "getAllLights").and.returnValue(lightSwitches);
        spyOn(document, "getElementById").and.callFake(function(element) {
            switch (element) {
                case "light01":
                    return lights[0];
                case "light02":
                    return lights[1];
                case "light03":
                    return lights[2];
                case "light04":
                    return lights[3];
                default:
                    return null;
            }
        });

        window.switchAllLights();

        expect(window.toggleLight).toHaveBeenCalledWith(lights[1]);
        expect(window.toggleLight.calls.count()).toBe(1);
    });



    it("getAllLights returns only elements with name switch* that are visible", function() {
        var tagNameG = [
            {"id": "light01", "classList": { "contains": function(css) { return css === "invisible"; }}},
            {"id": "switch01", "classList": { "contains": function(css) { return css === "invisible"; }}},
            {"id": "light02", "classList": { "contains": function() { return false; }}},
            {"id": "switch02", "classList": { "contains": function() { return false; }}}
        ];
        spyOn(document.body, "getElementsByTagName").and.returnValue(tagNameG);

        var result = window.getAllLights();
        expect(result.length).toBe(1);
        expect(result[0].id).toBe("switch02");
    });



    it("switchLight calls toggleLight", function() {
        spyOn(window, "toggleLight");
        spyOn(document, "getElementById").and.returnValue(42);
        window.switchLight({target: {id: "03"}});
        expect(document.getElementById).toHaveBeenCalledWith("light03");
        expect(window.toggleLight).toHaveBeenCalledWith(42);
    });



    it("toggleLight switches a light that is ON", function() {
        var light = { "id": "light66", "classList": { "contains": function() { return false; }, "add": function(){}}};
        spyOn(light.classList, "add");

        window.lightsOnCounter = 1;

        window.toggleLight(light);

        expect(jasmine.Ajax.requests.mostRecent().method).toBe("POST");
        expect(jasmine.Ajax.requests.mostRecent().url).toBe(window.url + light.id);
        expect(jasmine.Ajax.requests.mostRecent().data()).toEqual({"OFF": jasmine.anything()});

        jasmine.Ajax.requests.mostRecent().respondWith({
           "status": 201
        });

        expect(light.classList.add).toHaveBeenCalledWith("invisible");
        expect(window.lightsOnCounter).toBe(0);
    });

    it("toggleLight switches a light that is OFF", function() {
        var light = { "id": "light66", "classList": { "contains": function(css) { return css === "invisible"; },
            "remove": function(){}}};
        spyOn(light.classList, "remove");

        window.lightsOnCounter = 0;

        window.toggleLight(light);

        expect(jasmine.Ajax.requests.mostRecent().method).toBe("POST");
        expect(jasmine.Ajax.requests.mostRecent().url).toBe(window.url + light.id);
        expect(jasmine.Ajax.requests.mostRecent().data()).toEqual({"ON": jasmine.anything()});

        jasmine.Ajax.requests.mostRecent().respondWith({
           "status": 201
        });

        expect(light.classList.remove).toHaveBeenCalledWith("invisible");
        expect(window.lightsOnCounter).toBe(1);
    });



    it("loadInlineSVG loads the SVG file into the HTML", function() {
        var svgContent = "this is not an image",
            svgHTML = { "innerHTML" : "" };

        spyOn(document, "getElementById").and.returnValue(svgHTML);
        spyOn(window, "loadLights");

        window.loadInlineSVG();

        expect(jasmine.Ajax.requests.mostRecent().method).toBe("GET");
        expect(jasmine.Ajax.requests.mostRecent().url).toBe("img/office_lights.svg");

        jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "responseText": svgContent
        });

        expect(svgHTML.innerHTML).toBe(svgContent);
        expect(window.loadLights).toHaveBeenCalled();
    });



    it("loadLights loads the active switches", function() {
        var json = "{\"item\":[" +
                "{\"type\":\"SwitchItem\",\"name\":\"light01\",\"state\":\"OFF\"}," +
                "{\"type\":\"SwitchItem\",\"name\":\"light02\",\"state\":\"OFF\"}," +
                "{\"type\":\"SwitchItem\",\"name\":\"light03\",\"state\":\"OFF\"}" +
                "]}",
            switches = [
                {"id": "switch01", "classList": { "contains": function(css) { return css === "invisible"; },
                    "remove": function() {} }, "addEventListener": function() {} },
                {"id": "switch02", "classList": { "contains": function(css) { return css === "invisible"; },
                    "remove": function() {} }, "addEventListener": function() {} },
                {"id": "switch03", "classList": { "contains": function(css) { return css === "invisible"; },
                    "remove": function() {} }, "addEventListener": function() {} },
                {"id": "switch04", "classList": { "contains": function(css) { return css === "invisible"; },
                    "remove": function() {} }, "addEventListener": function() {} }
            ],
            mainswitch = { "addEventListener": function() {}};

        spyOn(document, "getElementById").and.callFake(function(element) {
            switch (element) {
                case "switch01":
                    return switches[0];
                case "switch02":
                    return switches[1];
                case "switch03":
                    return switches[2];
                case "switch04":
                    return switches[3];
                case "mainswitch":
                    return mainswitch;
                default:
                    return null;
            }
        });

        spyOn(mainswitch, "addEventListener");
        spyOn(switches[0], "addEventListener");
        spyOn(switches[1], "addEventListener");
        spyOn(switches[2], "addEventListener");
        spyOn(switches[3], "addEventListener");

        spyOn(switches[0].classList, "remove");
        spyOn(switches[1].classList, "remove");
        spyOn(switches[2].classList, "remove");
        spyOn(switches[3].classList, "remove");

        spyOn(window, "loadStates");

        window.loadLights();

        expect(mainswitch.addEventListener).toHaveBeenCalled();

        expect(jasmine.Ajax.requests.mostRecent().method).toBe("GET");
        expect(jasmine.Ajax.requests.mostRecent().url).toBe(window.url + window.json);


        jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "responseText": json
        });

        expect(switches[0].addEventListener).toHaveBeenCalled();
        expect(switches[1].addEventListener).toHaveBeenCalled();
        expect(switches[2].addEventListener).toHaveBeenCalled();
        expect(switches[3].addEventListener).not.toHaveBeenCalled();

        expect(switches[0].classList.remove).toHaveBeenCalledWith("invisible");
        expect(switches[1].classList.remove).toHaveBeenCalledWith("invisible");
        expect(switches[2].classList.remove).toHaveBeenCalledWith("invisible");
        expect(switches[3].classList.remove).not.toHaveBeenCalled();

        expect(window.loadStates).toHaveBeenCalled();
    });



    it("loadStates loads the active lights", function() {
        var json = "{\"item\":[" +
                "{\"type\":\"SwitchItem\",\"name\":\"light01\",\"state\":\"OFF\"}," +
                "{\"type\":\"SwitchItem\",\"name\":\"light02\",\"state\":\"OFF\"}," +
                "{\"type\":\"SwitchItem\",\"name\":\"light03\",\"state\":\"ON\"}," +
                "{\"type\":\"SwitchItem\",\"name\":\"light04\",\"state\":\"ON\"}," +
                "{\"type\":\"SwitchItem\",\"name\":\"light06\",\"state\":\"ON\"}" + // No light06 in the "DOM"
                "]}",
            lights = [
                {"id": "light01", "classList": { "contains": function(css) { return css === "invisible"; },
                    "remove": function() {}, "add": function() {} }},
                {"id": "light02", "classList": { "contains": function() { return false; },
                    "remove": function() {}, "add": function() {} }},
                {"id": "light03", "classList": { "contains": function(css) { return css === "invisible"; },
                    "remove": function() {}, "add": function() {} }},
                {"id": "light04", "classList": { "contains": function() { return false; },
                    "remove": function() {}, "add": function() {} }},
                {"id": "light05", "classList": { "contains": function() { return false; },
                    "remove": function() {}, "add": function() {} }} // No state for light05
            ];

        spyOn(document, "getElementById").and.callFake(function(element) {
            switch (element) {
                case "light01":
                    return lights[0];
                case "light02":
                    return lights[1];
                case "light03":
                    return lights[2];
                case "light04":
                    return lights[3];
                case "light05":
                    return lights[4];
                default:
                    return null;
            }
        });

        spyOn(lights[0].classList, "add");
        spyOn(lights[1].classList, "add");
        spyOn(lights[2].classList, "remove");
        spyOn(lights[3].classList, "remove");
        spyOn(lights[4].classList, "remove");

        window.loadStates();

        expect(jasmine.Ajax.requests.mostRecent().method).toBe("GET");
        expect(jasmine.Ajax.requests.mostRecent().url).toBe(window.url + window.json);


        jasmine.Ajax.requests.mostRecent().respondWith({
            "status": 200,
            "responseText": json
        });

        expect(lights[0].classList.add).toHaveBeenCalledWith("invisible");
        expect(lights[1].classList.add).toHaveBeenCalledWith("invisible");
        expect(lights[2].classList.remove).toHaveBeenCalledWith("invisible");
        expect(lights[3].classList.remove).toHaveBeenCalledWith("invisible");
        expect(lights[4].classList.remove).not.toHaveBeenCalled();

        expect(window.lightsOnCounter).toBe(2);
    });
});