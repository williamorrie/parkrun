const icons = {
  nodata: { name: "No ranking", icon: "info_circle.png" },
  fast: { name: "Fast / flat", icon: "hiker.png" },
  medium: { name: "Medium", icon: "police.png" },
  slow: { name: "Slow / hilly", icon: "caution.png" },
};

function category(ranking) {
  if (!Number.isFinite(ranking) || ranking < 1) return icons.nodata;
  return ranking < 250 ? icons.fast : ranking < 500 ? icons.medium : icons.slow;
}

function rankingLabel(ranking) {
  const type = category(ranking);
  return type === icons.nodata
    ? type.name
    : `${type.name} · Rank ${ranking} / ~750`;
}

const mapStatus = document.getElementById("map-status");
const mapElement = document.getElementById("map");
const listStatus = document.getElementById("list-status");
const search = document.getElementById("event-search");
const eventList = document.getElementById("event-list");

const eventData = fetch("../data.geojson")
  .then((response) => {
    if (!response.ok) throw new Error("Event data could not be loaded");
    return response.json();
  })
  .then((data) => {
    const events = [...data.features].sort((a, b) =>
      a.properties.index.localeCompare(b.properties.index)
    );
    function renderEvents() {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = events.filter((event) =>
        event.properties.index.toLocaleLowerCase().includes(query)
      );
      const items = document.createDocumentFragment();
      for (const event of matches) {
        const item = document.createElement("li");
        const title = document.createElement("h3");
        title.textContent = event.properties.index;
        const rank = document.createElement("p");
        rank.className = "event-ranking";
        rank.textContent = rankingLabel(event.properties.ranking);
        item.append(title, rank);
        if (event.properties.course?.description) {
          const description = document.createElement("p");
          description.textContent = event.properties.course.description;
          item.append(description);
        }
        items.append(item);
      }
      eventList.replaceChildren(items);
      listStatus.textContent = matches.length
        ? `${matches.length} of ${events.length} saved events`
        : "No events match your search. Try another name.";
    }
    search.disabled = false;
    search.addEventListener("input", renderEvents);
    renderEvents();
    return data;
  })
  .catch(() => {
    listStatus.textContent = "The saved events could not be loaded. Try reloading, download the data below, or use the official parkrun event directory linked above.";
    return null;
  });

let mapFailed = false;

function mapUnavailable() {
  mapFailed = true;
  mapElement.hidden = true;
  mapStatus.textContent = "Google Maps is unavailable. Browse or search the event list below instead.";
}

window.gm_authFailure = mapUnavailable;
window.initMap = async function () {
  try {
    const data = await eventData;
    if (mapFailed) return;
    if (!data) {
      mapStatus.textContent = "The map needs the saved event data, which could not be loaded. Try reloading the page.";
      return;
    }
    mapElement.hidden = false;
    const map = new google.maps.Map(mapElement, {
      center: { lat: 54.598, lng: -5.929 },
      zoom: 6,
      mapTypeId: "terrain",
    });
    map.data.addGeoJson(data);
    map.data.setStyle((feature) => ({
      icon: "https://maps.google.com/mapfiles/kml/shapes/" +
        category(feature.getProperty("ranking")).icon,
      clickable: true,
      title: `${feature.getProperty("index")}: ${rankingLabel(feature.getProperty("ranking"))}`,
    }));
    map.data.addListener("click", (event) => {
      document.getElementById("info-box").textContent =
        `${event.feature.getProperty("index")}: ${rankingLabel(event.feature.getProperty("ranking"))}`;
    });
    mapStatus.textContent = "Select a marker for its ranking, or browse the event list below.";
  } catch {
    mapUnavailable();
  }
};

const mapsApiKey = document.querySelector('meta[name="google-maps-api-key"]').content.trim();
if (mapsApiKey) {
  mapStatus.textContent = "Loading Google Maps… The event list is available independently below.";
  const script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?" + new URLSearchParams({
    key: mapsApiKey,
    callback: "initMap",
    v: "weekly",
    loading: "async",
  });
  script.async = true;
  script.onerror = mapUnavailable;
  document.head.append(script);
}
