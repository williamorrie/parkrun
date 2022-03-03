let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(54.875, -6.735),
    mapTypeId: "terrain",
    zoom: 9,
  });
  map.data.loadGeoJson(
      "./data.geojson"
  );
  map.data.setStyle(function(feature) {
    const marker_base = "http://maps.google.com/mapfiles/ms/icons/"
    var ranking = feature.getProperty('ranking');
    var marker_url = ranking == '-' ? marker_base + 'black-dot.png' : 
                     ranking < 250 ? marker_base + 'green-dot.png' : 
                     ranking < 500 ? marker_base + 'orange-dot.png' : 
                     marker_base + 'red-dot.png';
    return {
      icon: marker_url;
    };
  });
};
