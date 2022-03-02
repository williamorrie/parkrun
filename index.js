let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(54.875, -6.735),
    mapTypeId: "terrain",
    zoom: 9,
  });
  map.data.loadGeoJson(
      "./merged_layers_cleaned.json"
      );
//  map.data.setStyle({strokeColor:'red',
//                     icon: image});
};
