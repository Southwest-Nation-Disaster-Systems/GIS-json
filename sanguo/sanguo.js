const { createApp, ref } = Vue;
const app = createApp({
  mounted() {
    var apiKey = "AgXWxa8RRy37MM7dP1x8TAbEwF_4ycGxcUXLeseYJ2A7J1b25tD6y6PEbe4udlYD";
    var map = new ol.Map({
      target: "map",
      layers: [
        new ol.layer.Tile({
          source: new ol.source.BingMaps({
            key: apiKey,
            imagerySet: "Aerial",
          }),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([110.195397, 38.86166]),
        zoom: 4.6,
      }),
    });

    var vectorSource = new ol.source.Vector();
    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: function (feature, resolution) {
        var text = feature.get("NAME_CH");
        var textStyle = new ol.style.Text({
          text: text,
          fill: new ol.style.Fill({
            color: "white",
          }),
          stroke: new ol.style.Stroke({
            color: "black",
            width: 2,
          }),
        });
        return new ol.style.Style({
          text: textStyle,
          stroke: new ol.style.Stroke({
            color: "rgb(177, 197, 180)",
            width: 2,
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        });
      },
    });

    map.addLayer(vectorLayer);
    
    var jsonFiles = [
      "https://raw.githubusercontent.com/Southwest-Nation-Disaster-Systems/GIS-json/main/sanguo/Export_Output.json",
      "https://raw.githubusercontent.com/Southwest-Nation-Disaster-Systems/GIS-json/main/sanguo/Export_Output_5.json",
    ];
    
    function updateData() {
      var currentZoom = map.getView().getZoom();
      var zoomLevel = Math.floor(currentZoom);
      var vectorSource = vectorLayer.getSource();
      vectorSource.clear();

      if (zoomLevel >= 4 && zoomLevel < jsonFiles.length + 4) {
        var jsonFileIndex = zoomLevel - 4;
        fetch(jsonFiles[jsonFileIndex])
          .then((response) => response.json())
          .then((data) => {
            vectorSource.addFeatures(
              new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: "EPSG:3857",
              })
            );
          });
      } else if (zoomLevel >= jsonFiles.length + 2) {
        var jsonFileIndex = jsonFiles.length - 1;
        fetch(jsonFiles[jsonFileIndex])
          .then((response) => response.json())
          .then((data) => {
            vectorSource.addFeatures(
              new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: "EPSG:3857",
              })
            );
          });
      }
    }
    
    map.on("moveend", updateData);
    updateData();
  },
  data() {
    return {
      fullscreenLoading: false,
    }
  },
  methods: {
    switchMap() {
      const loading = this.$loading({
        lock: true,
        text: 'Gis地图加载中',
        background: 'rgba(0, 0, 0, 0.8)',
      });
      setTimeout(() => {
        window.location.href = "Visualization.html";
        loading.close();
      }, 2000);
    }
  }
});
app.use(ElementPlus)
app.mount('#app');