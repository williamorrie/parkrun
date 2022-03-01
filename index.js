let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(54.897, -6.666),
    mapTypeId: "terrain",
    zoom: 9,
  });
  map.data.loadGeoJson(
      "https://parkrun-map.azurewebsites.net/api/parkruns/geobox?lat=54&lon=-7&lat=55&lon=-3"
      );
//  map.data.setStyle({strokeColor:'red',
//                     icon: image});
};
