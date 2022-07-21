// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  console.log(data)
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// function createFeatures(earthquakeData) {

//   // Define a function that we want to run once for each feature in the features array.
//   // Give each feature a popup that describes the place and time of the earthquake.
//   //function called onEachFeature 

  

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    
    layer.bindPopup(`<h3>Location: ${feature.location}, Magnitude: ${feature.properties.mag}, Place: ${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  
  }

  function changeColor(features)

  function pointToLayer(feature, latlng) {
    return L.circleMarker(feature, latlng)
    // Set the style of the markers based on properties.mag
      // fillOpacity: 0.75,
      // color: "black",
      // weight: 1,
      // fillColor: getColor(feature.properties.mag),
      // radius: getRadius(feature.properties.mag)
      // fillColor: chooseColor(feature.geometry.coordinates[2]),
      // fillOpacity: 0.8,
      // color: "#000",
      // weight: 1, 
      // opacity: 1, 
      // stroke: true,
      // weight: 0.5,
      // radius: markerSize(feature.properties.mag),
    }

  
  let earthquakes = L.geoJSON(earthquakeData, {
    // as teh geojson will run the function above as it goes through each earthquake 
    onEachFeature: onEachFeature,
   pointToLayer: pointToLayer

    
  })

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // boiler plate code here for the tile-layersCreate the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  
  // * Create a legend that will provide context for your map data.
  //legend street map and topographic map 
  // Create a baseMaps object.

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // second part of legend Earthquakes 
  // Create an overlay object to hold our overlay.

  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map

  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    // layers: [street, earthquakes] on initial load up of page it will show the markers and the street view of the map by default 
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
