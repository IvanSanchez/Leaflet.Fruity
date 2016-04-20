# Leaflet.Fruity

A [LeafletJS](http://www.leafletjs.com) plugin for bootstrapping Apple maps, mapkit-style.

Inspired by https://github.com/TimBroddin/fruitymaps. Thanks, Tim!

You can find a [live demo right here](http://ivansanchez.github.io/Leaflet.Fruity/demo.html).



## Usage


### `L.map.fruity(div, options, bootstrap)`

Instantiates a new fruity map. Takes in the DOM ID of a `<div>` and a set of options just as `L.Map`, plus a mapkit bootstrap definition JSON.

Optionally, pass a URL as the `bootstrap` parameter, and Leaflet Fruity will try to fetch that URL and interpret it as JSON.

This will automatically instantiate tilelayers and add a layers control. The list of instantiated layers can be fetched with the new `.getFruityLayers()` method.



### `L.tileLayer.fruity(bootstrap, tileSource, options)`

Instantiates a new `L.TileLayer`, given the (full) bootstrap JSON, a string defining the tile source (either `standard`, `standard-base`, `hybrid-overlay` or `satellite`), and a set of `L.TileLayer` options.

This will automatically fill up quite a few of the `L.TileLayer` options such as tile size and min-max zoom levels.





## Legalese

Licensed under the GNU General Public License version 3 (or "GPL3"). Check the
full text at https://www.gnu.org/licenses/gpl-3.0.html.