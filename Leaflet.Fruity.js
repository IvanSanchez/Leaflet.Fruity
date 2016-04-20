
L.TileLayer.Fruity = L.TileLayer.extend({

	initialize: function(bootstrapJson, tileSource, options) {
		this._bootstrap = bootstrapJson;
		options = options || {};

		var tss = this._bootstrap.tileSources;

		for (var i in tss) {
			if (tss[i].tileSource === tileSource) {
				var ts = tss[i];

				// 0 = 128px; 1 = 256px; 2 = 512px
				/// TODO: Check against ts.supportedSizes
				this._tileSizeIndex = 1;
				if (options.tileSize === 128) { this._tileSizeIndex = 0; }
				if (options.tileSize === 512) { this._tileSizeIndex = 2; }


				// 1 or 2 AKA "retina", AKA devicePxPerCssPx
				this._resolution = 1;
				if (L.Browser.retina && (ts.supportedResolutions.indexOf(2) !== -1)) {
					this._resolution = 2;
				}

				/// TODO: Check against ts.supportedLanguages
				this._lang = 'en';


				// Seems to be defined by the client and passed when requesting the bootstrap file
				// It's 1 by default, meaning "nothing"
				this._poi = options.poi || 1;


				options.minZoom = ts.minZoomLevel;
				options.maxZoom = ts.maxZoomLevel;

				options.subdomains = ts.domains;

				var url = 'https://{domain}' + ts.path
					.replace(new RegExp('{{', 'gm'),'{')
					.replace(new RegExp('}}', 'gm'),'}');

				/// FIXME: refer to the attributions array in the bootstrap.
				options.attribution = "Map © <a href='http://gsp21.ls.apple.com/html/attribution-22.html'>Apple, TomTom, others</a>.";

				return L.TileLayer.prototype.initialize.call(this, url, options);
			}
		}
		throw (new Error('Invalid tile source name: ' + tileSource.toString()));
	},

	getTileUrl: function (coords) {
		var data = {
			tileSizeIndex: this._tileSizeIndex,
			resolution: this._resolution,
			domain: this._getSubdomain(coords),
			lang: this._lang,
			poi: this._poi,
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl()
		};

		return L.Util.template(this._url, L.extend(data));
	},

});






L.Map.Fruity = L.Map.extend({

	options: {
		// Default API key = the one found at https://developer.apple.com/wwdc/attending/
		apiKey: 'b2af5300a3c2ea9b5d38c782c7d2909dc88d6621',

		// Seems to be the way of asking for a specific bootstrap for a specific
		// POI (which maybe is highlighted)
		poi: 1
	},

	initialize: function(id, options, bootstrap) {
		L.Map.prototype.initialize.call(this, id, options);

		if (!bootstrap) {
			bootstrap = L.Util.template('https://cdn.apple-mapkit.com/ma/bootstrap?apiVersion=1&vendorkey={apiKey}&mkjsVersion=3.0.0&poi={poi}', this.options);
		}

		this._initFromBootstrap(bootstrap);
	},

	_initFromBootstrap: function(bootstrap) {
		if (typeof bootstrap === 'string') {
			var _this = this;

			if (window.fetch) {
				fetch(bootstrap).then(function(response){
					if (response.status >= 400) {
						throw new Error(response.status + ' ' + response.statusText);
					}
					return response.json();
				}).then(function(json){
					_this._initFromBootstrap();
				});
			} else {
				// No fetch API, fallback to ol' AJAX
				var req = new XMLHttpRequest();

				req.onreadystatechange = function(response) {
					if (req.readyState === XMLHttpRequest.DONE) {
						if (req.status === 200) {
							_this._initFromBootstrap(res.responseJson);
						}
					}
				};
				req.open('GET', bootstrap);
				req.send();
			}
			return;
		}

		var modes = {};

		for (var i in bootstrap.modes) {

			var mode = L.featureGroup();

			for (var j in bootstrap.modes[i].layers) {
				var layer = L.tileLayer.fruity(bootstrap, bootstrap.modes[i].layers[j].tileSource);

				// TODO: use maximumOverdrawScale to tweak maxZoom and maxNativeZoom
				mode.addLayer(layer);
			}

			modes[i] = mode;
		}

		mode.addTo(this);
		this._fruityLayerControl = L.control.layers(modes).addTo(this);
		this._fruityLayers = modes;
	},

	getFruityLayers: function(){
		return this._fruityLayers;
	}


});




L.tileLayer.fruity = function(bootstrap, tileSource, options) {
	return new L.TileLayer.Fruity(bootstrap, tileSource, options);
};


L.map.fruity = function(id, options, bootstrap){
	return new L.Map.Fruity(id, options, bootstrap);
};
