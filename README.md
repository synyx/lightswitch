Sybil Light Switches
====================

UI for switching lights on/off in the office using OpenHAB.

## Building/Running

Nothing to build, just copy the contents of the `src`-folder to your webserver.

## Customizing

Change the `url` variable in `src/js/main.js` to point to your OpenHAB API.

The names of the lights in OpenHAB should be `lightXX` where `XX` is a number (with leading zeros where necessary).

On the SVG there are *switch* layers, with the id `switchXX`, which are made visible (and thus clickable) when there is
an object named `lightXX` in the OpenHAB API.
The *clickable* layers have the id `XX`, and when clicked upon will toggle the `lightXX` in the OpenHAB API and turn the
*light* layer with id `lightXX` visible/invisible (i.e. ON/OFF) in the SVG.

To edit the SVG, be careful not to disturb the hand-edited XML and styles. Inkscape is not a good choice for this, it
will require manual editing of the XML afterwards!  
Try using [Draw SVG](http://www.drawsvg.org/) instead.

## Testing

You need [npm](https://www.npmjs.com/) installed and run `npm install` in the project folder once.

Then run `npm test` to run tests.

## Credits
Office Map by Thomas Kraft  
Background pattern from subtlepatterns.com

## License
Copyright 2015 Tobias Theuer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
