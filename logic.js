const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(data => {
    console.log(data);
    console.log(d3.extent(data.features.map(d => d.properties.mag)))
    cearteFeatures(data.features);
})