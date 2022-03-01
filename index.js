let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(55.875, -6.735),
    mapTypeId: "terrain",
    zoom: 9,
  });
  map.data.loadGeoJson(
      "data.json"
      );
//  map.data.setStyle({strokeColor:'red',
//                     icon: image});
};
