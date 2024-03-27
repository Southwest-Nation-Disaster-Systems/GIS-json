var apiKey = "AgXWxa8RRy37MM7dP1x8TAbEwF_4ycGxcUXLeseYJ2A7J1b25tD6y6PEbe4udlYD"; // 替换为你自己的 Bing Maps API 密钥

var map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.BingMaps({
        key: apiKey,
        imagerySet: "Aerial", // 使用卫星图层
      }),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([104.195397, 35.86166]), // 设置初始中心点为中国中心
    zoom: 4, // 设置初始缩放级别
  }),
});

var vectorSource = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: function (feature, resolution) {
    var text = feature.get("NAME_CH"); // 假设地名属性在JSON数据的"NAME_CH"字段中
    var textStyle = new ol.style.Text({
      text: text,
      fill: new ol.style.Fill({
        color: "white", // 设置地名颜色为白色
      }),
      stroke: new ol.style.Stroke({
        color: "black", // 添加黑色描边
        width: 2,
      }),
    });
    return new ol.style.Style({
      text: textStyle,
      stroke: new ol.style.Stroke({
        color: "blue", // 设置省份边界线颜色为蓝色
        width: 2, // 设置边界线宽度
      }),
    });
  },
});

map.addLayer(vectorLayer);

// JSON 数据文件数组
var jsonFiles = [
  
  // "https://raw.githubusercontent.com/Southwest-Nation-Disaster-Systems/GIS-json/main/ming/Export_Output.json",
  // "https://raw.githubusercontent.com/Southwest-Nation-Disaster-Systems/GIS-json/main/ming/Export_Output_5.json",
  // "https://raw.githubusercontent.com/ChenSK23/GIS/main/Export_Output.json",
  // "https://raw.githubusercontent.com/ChenSK23/GIS/main/Export_Output_5.json",
  "https://raw.githubusercontent.com/Southwest-Nation-Disaster-Systems/GIS-json/main/yuan/Export_Output.json",
  "https://raw.githubusercontent.com/Southwest-Nation-Disaster-Systems/GIS-json/main/yuan/Export_Output_5.json",

  // 添加更多 JSON 文件的 URL
];

// 根据当前缩放级别设置显示内容
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
    // 在最后一个 JSON 文件后保持显示
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

// 添加点击事件处理程序
map.on("click", function (event) {
  var coordinate = event.coordinate;

  // 获取点击的地区信息
  var clickedFeature = map.forEachFeatureAtPixel(
    event.pixel,
    function (feature) {
      return feature;
    }
  );

  // 替换以下示例路径为实际路径
  var imagePath = "1.png";

  // 检查是否点击了黑龙江
  if (clickedFeature && clickedFeature.get("NAME_CH") === "黑龙江") {
    // 创建并设置图片元素
    var imageElement = document.createElement("img");
    imageElement.src = imagePath;
    imageElement.alt = "Clicked Image";

    // 显示图片容器，并将图片添加到容器中
    imageContainer.style.display = "block";
    displayedImage.innerHTML = "";
    displayedImage.appendChild(imageElement);
  } else {
    // 隐藏图片容器
    imageContainer.style.display = "none";
  }
});
