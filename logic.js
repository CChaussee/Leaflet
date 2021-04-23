//Most code provided by ClassActivity 1.10 in Leaflet chapter
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 
  


d3.json(queryUrl).then(data => {
  console.log(data);
  console.log(d3.extent(data.features.map(d => d.properties.mag)))

  createFeatures(data.features);
  
});

function createFeatures(earthquakeData) {


  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


 
//Defining Magnitude
  const mags = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return new L.Circle(latlng, {
        radius: feature.properties.mag*25000,
        fillColor: getColor(feature.properties.mag),
        stroke: false 
      });
    }
  });
 //Providing color based on magnitude size, like in class activity 2.1
function getColor(magnitude) {
    switch (true) {
    case magnitude > 7:
      return "#B22222"
    case magnitude > 6:
      return "#8B0000"
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#48D1CC";
    case magnitude > 1:
      return "#90EE90";
    default:
      return "#FFEFD5";
    }
  }

  createMap(mags);
}


function createMap(mags) {

//Defining layers
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
//Overlay maps
  const overlayMaps = {
    Magnitudes: mags
  };

  const myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, mags]
  });


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
}

//Creating legend for map
// const legend = L.control({position: 'bottomright'});
// legend.onAdd = function (map) {
//   const div = L.DomUtil.create('div', 'info legend');
//   div.innerHTML='Eathquake<br>Magnitude<br><hr>'
// }
// legend.addTo(myMap)