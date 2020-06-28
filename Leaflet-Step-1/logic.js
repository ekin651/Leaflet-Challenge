var apiKey = "pk.eyJ1IjoidHVyYS1hZ3UiLCJhIjoiY2s3bWh0MXlpMDBudTNodDNwZjdodmI4cyJ9.H2826AgkUyDtSV56v1-oYA";
var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: apiKey
});
//  create the map object
var map = L.map("mapid", {
    center: [40.7, -94.5],
    zoom: 10
});
// add graymap  to the map.
graymap.addTo(map);


// retrieves my earthquake data to geoJSON data.

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

    function styleabout(feature) {
        return {
            opacity: 0.9,
            fillOpacity: 0.9,
            fillColor: chooseColor(feature.properties.mag),
            color: "#000000",
            radius: calRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    //  the color of the marker for magnitude of the earthquake.
    function chooseColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#e91c1c";
            case magnitude > 4:
                return "#ec683c";
            case magnitude > 3:
                return "#f5a700";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#d4ee00";
            default:
                return "#a3ff05";
        }
    }

    //radius of the earthquake marker on magnitude

    function calRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }


    //add a GeoJSON layer to the map after the file is loaded.
    L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: styleabout,

        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);




    // Here we create a legend control object.
    var legend = L.control({
        position: "bottomright"
    });

    // Then add all the details for the legend
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Finally, we our legend to the map.
    legend.addTo(map);
});