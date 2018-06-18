let Map = ( function () {
  
  let $map = L.map('map', {
    center: [0, 0],
    zoom: 13
  });
  $map.createPane('labels');
  $map.getPane('labels').style.zIndex = 650;
  
  var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '©OpenStreetMap, ©CartoDB'
  }).addTo($map);
  
  var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
      attribution: '©OpenStreetMap, ©CartoDB',
      pane: 'labels'
  }).addTo($map);
  
  $map.on("contextmenu", function (event) {
    event.preventDefault();
    
    console.log("Coordinates: " + event.latlng.toString());
    L.marker(event.latlng).addTo($map);
  });
  
  
} )();