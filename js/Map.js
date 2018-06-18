let Map = ( function () {
  
  let corner1 = L.latLng(27.4, 111.4),
      corner2 = L.latLng(47.4, 131.4),
      bounds = L.latLngBounds(corner1, corner2);
  
  let $map = L.map('map', {
    center: [37.4, 121.4],
    zoom: 5,
    minZoom: 4,
    maxZoom: 13,
    maxBounds: bounds
  });
  $map.createPane('labels');
  $map.getPane('labels').style.zIndex = 650;
  
  let positron = L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png', {
  }).addTo($map);
  
  let positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png', {
      pane: 'labels'
  }).addTo($map);
  
  function init() {
    console.log("hi");
    
    $map.on("click", function(e) {
      console.log("Coordinates: " + e.latlng.toString());
      L.marker(e.latlng).addTo($map);
    });
  
    $map.on("contextmenu", function(e) {
      e.preventDefault();

      console.log("Coordinates: " + e.latlng.toString());
      L.marker(e.latlng).addTo($map);
    });
  }
  
  return {
    init: init
  }
  
} )();