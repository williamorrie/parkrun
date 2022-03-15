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

  const marker_base = "https://maps.google.com/mapfiles/kml/shapes/"
  const icons = {
    nodata: {
      name: "No Data",
      icon: marker_base + 'info_circle.png'
    },
    fast: {
      name: "Fast/Flat Park Run",
      icon: marker_base + 'hiker.png'
    },
    medium: {
      name: "Medium Park Run",
      icon: marker_base + 'police.png'
    },
    slow: {
      name: "Slow/Hilly Park Run",
      icon: marker_base + 'caution.png'
      
    }
  }
  
  map.data.setStyle(function(feature) {
    //const marker_base = "https://maps.google.com/mapfiles/ms/icons/"
    
    var ranking = parseInt(feature.getProperty('ranking'));
    var marker_url = ranking == -1 ? icons.nodata.icon : 
                     ranking < 250 ? icons.fast.icon : 
                     ranking < 500 ? icons.medium.icon : 
                     icons.slow.icon;
    var hover_title = feature.getProperty('index') + ": " + ranking + "/750 (approx.)"
    return {
      icon: marker_url,
      clickable: true,
      title: hover_title
    };
  });
  ///// TODO
  ///// Popup with description and URL
    // Set mouseover event for each feature.
  map.data.addListener("click", function(e) {
    document.getElementById("info-box").textContent =
    e.feature.getProperty('index') + ": " + e.feature.getProperty('ranking') + "/750 (approx.)"
  });
  
  const legend = document.getElementById("legend");

  for (const key in icons) {
    const type = icons[key];
    const name = type.name;
    const icon = type.icon;
    const div = document.createElement("div");

    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  
};
  