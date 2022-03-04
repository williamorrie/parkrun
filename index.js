let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: new google.maps.LatLng(54.598, -5.929),
    mapTypeId: "terrain",
    zoom: 11,
  });


  map.data.loadGeoJson(
      "./data.geojson"
  );

  map.data.setStyle(function(feature) {
    //const marker_base = "https://maps.google.com/mapfiles/ms/icons/"
    const marker_base = "https://maps.google.com/mapfiles/kml/shapes/"
    var ranking = parseInt(feature.getProperty('ranking'));
    var marker_url = ranking == -1 ? marker_base + 'info_circle.png.png' : 
                     ranking < 250 ? marker_base + 'hiker.png' : 
                     ranking < 500 ? marker_base + 'police.png' : 
                     marker_base + 'caution.png';
    return {
      icon: marker_url,
      clickable: true,
      title: ranking
    };
  });
    // Set mouseover event for each feature.
  map.data.addListener("mouseover", (event) => {
    document.getElementById("info-box").textContent =
      "URI " + + event.feature.getProperty("uri") +
      "Ranking: " + event.feature.getProperty("ranking") +
      "Index: " + event.feature.getProperty("index");
  });
};
