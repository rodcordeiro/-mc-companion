export const VIEWER_BOOTSTRAP = `
(function () {
  var state = {
    map: null,
    tileLayer: null,
    markersLayer: null,
    markersById: {},
    lastInit: null,
    dimension: 'overworld'
  };

  function post(message) {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }

  function minecraftToLatLng(x, z) {
    return L.latLng(-z, x);
  }

  function tileUrl(init, coords) {
    var dim = init.metadata.dimensions[state.dimension];
    var path = dim && dim.tilePath ? dim.tilePath : 'tiles/';
    var format = init.metadata.imageFormat || 'png';
    var base = init.tileBaseUrl;
    if (base.charAt(base.length - 1) !== '/') base += '/';
    return base + path + coords.z + '/' + coords.x + '.' + coords.y + '.' + format;
  }

  function clearOverlay() {
    if (state.markersLayer) {
      state.markersLayer.clearLayers();
    }
    state.markersById = {};
  }

  function applyOverlay(overlay) {
    if (!state.markersLayer) return;
    clearOverlay();
    (overlay || []).forEach(function (item) {
      if (item.dimensao && item.dimensao !== state.dimension) return;
      var marker = L.circleMarker(minecraftToLatLng(item.x, item.z), {
        radius: 8,
        color: '#6BBE6B',
        weight: 2,
        fillColor: '#9CDE9C',
        fillOpacity: 0.95
      });
      marker.on('click', function (event) {
        if (event && event.originalEvent) {
          L.DomEvent.stopPropagation(event);
        }
        post({ type: 'markerPress', id: item.id });
      });
      marker.addTo(state.markersLayer);
      state.markersById[item.id] = marker;
    });
  }

  function ensureMap(init) {
    if (state.map) return;
    var minZoom = init.metadata.minZoom;
    var maxZoom = init.metadata.maxZoom;
    state.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: minZoom,
      maxZoom: maxZoom,
      zoomControl: true,
      attributionControl: false
    });
    state.map.on('click', function () {
      post({ type: 'emptyTap' });
    });
    state.markersLayer = L.layerGroup().addTo(state.map);
  }

  function setTileLayer(init) {
    if (state.tileLayer) {
      state.map.removeLayer(state.tileLayer);
      state.tileLayer = null;
    }
    state.tileLayer = L.tileLayer('', {
      minZoom: init.metadata.minZoom,
      maxZoom: init.metadata.maxZoom,
      noWrap: true,
      errorTileUrl: ''
    });
    state.tileLayer.getTileUrl = function (coords) {
      return tileUrl(init, coords);
    };
    state.tileLayer.addTo(state.map);
  }

  function centerMap(init, x, z, zoom) {
    var targetZoom = typeof zoom === 'number' ? zoom : init.metadata.defaultZoom;
    state.map.setView(minecraftToLatLng(x, z), targetZoom);
  }

  function handleInit(init) {
    state.lastInit = init;
    state.dimension = init.dimension || 'overworld';
    ensureMap(init);
    setTileLayer(init);
    var x = typeof init.centerX === 'number' ? init.centerX : (init.metadata.centerX || 0);
    var z = typeof init.centerZ === 'number' ? init.centerZ : (init.metadata.centerZ || 0);
    centerMap(init, x, z, init.zoom);
    applyOverlay(init.overlay || []);
    post({ type: 'ready' });
  }

  function handleMessage(raw) {
    var message;
    try {
      message = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (error) {
      post({ type: 'error', message: 'Mensagem inválida' });
      return;
    }
    if (!message || !message.type) return;
    if (message.type === 'init') {
      handleInit(message);
      return;
    }
    if (!state.map || !state.lastInit) return;
    if (message.type === 'setDimension') {
      state.dimension = message.dimension;
      setTileLayer(state.lastInit);
      applyOverlay(message.overlay || state.lastInit.overlay || []);
      return;
    }
    if (message.type === 'setOverlay') {
      state.lastInit.overlay = message.overlay || [];
      applyOverlay(state.lastInit.overlay);
      return;
    }
    if (message.type === 'centerOn') {
      if (message.dimension) {
        state.dimension = message.dimension;
        setTileLayer(state.lastInit);
      }
      applyOverlay(message.overlay || state.lastInit.overlay || []);
      centerMap(state.lastInit, message.x, message.z, message.zoom);
    }
  }

  document.addEventListener('message', function (event) {
    handleMessage(event.data);
  });
  window.addEventListener('message', function (event) {
    handleMessage(event.data);
  });
  window.__MC_COMPANION_VIEWER__ = handleMessage;
  post({ type: 'ready' });
})();
true;
`;
