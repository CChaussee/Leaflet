const myMap = L.map("map", {
  center: [38.89511, -77.03637],
  zoom: 7 
})

const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(queryUrl).then(data => {
    console.log(data);
    console.log(d3.extent(data.features.map(d => d.properties.mag)))
    createFeatures(data.features);
})

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
}

    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
    });

    const mags = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {
            return new L.Circle(latlng, {
                radius: feature.properties.mag*25000,
                fillColor: "red",
                stroke: false
            });
        }
    });

    createMap(earthquakes, mags);

function createMap(earthquakes, mags) {
    const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY

});

  const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
});
    const baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
  };

  const overlayMaps = {
    Earthquakes: earthquakes,
    Magnitudes: mags
  };
  const myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

