// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {

  console.log(data)
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.

  //function called onEachFeature 
  function onEachFeature(feature, layer) {

    //boiler plate bindPopup code
    // Give each feature a popup that describes the place and time of the earthquake.
    
    layer.bindPopup(`<h3>${feature.location}, ${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  
  function changeColor(features) {
    if (features.properties.mag > 7)
    return 'black'
    else if (features.properties.mag > 5)
    return 'red'
    else if (features.properties.mag > 2.5)
    return 'orange'
    else
    return 'purple'
  };

  function changeSize(features) {
    if (features.geometry.coordinates[2] > 100)
      return 0 
    else 
      return features.geometry.coordinates[2]

  }

 
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(features, latlng) {
      return L.circleMarker(latlng)
    },
    style: function geojsonMarkerOptions(features) {
      return {
          radius: changeSize(features),
          fillColor: changeColor(features),
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
  
      }
    }
  });
  
  //send earthquake layer to the createMap 
  createMap(earthquakes); 

  function createMap(earthquakes) {
  
    // boiler plate code here for the tile-layersCreate the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    //Create a legend that will provide context for your map data; per Bill's suggestion used Cloropleth 
    //Legend street map and topographic map 
    //Create a baseMaps object.
  
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
    
    let tectonicplates = new L.LayerGroup()

    // Create an overlay object to hold our overlay.
  
    let overlayMaps = {
      "Earthquakes": earthquakes, 
      "Tectonic Plates": tectonicplates
    };
  
    // Create our map
  
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      // layers: [street, earthquakes] on initial load up of page it will show the earthquakes circle markers and the street view of the map by default 
      layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to myMap.
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
      // Use `L.DomUtil.create('div', 'info legend')` to create a `div` with the `info` and `legend` classes
      // limits for the mags are the list of numbers 
    
        let div = L.DomUtil.create('div', 'info legend'),
            mags = [0, 2.5, 5, 7];
            colors = ['black', 'red', 'orange','purple'];
    
        // loop through our sintervals and generate a label with a colored square for each interval
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
        }
        return div; 
    };
    
    legend.addTo(myMap);

    

  // Perform a GET request to the query URL/
  d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(function (data) {

    L.geoJSON(data, {

    }).addTo(tectonicplates);

  tectonicplates.addTo(myMap)
   });
  };

}
