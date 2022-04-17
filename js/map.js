// import { drawMonthlyYeild } from  "../js/demo/chart-area-demo.js";
let polygonArea = 0 ;
// https://stackoverflow.com/questions/46934768/leaflet-draw-delete-button-remove-clear-all-action
let map = L.map(document.getElementById('map'), {zoomControl: false}).setView([23.574196615833014, 58.60898516671025], 20);

L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 40,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);




// Initialise the FeatureGroup to store editable layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawPluginOptions = {
  position: 'topleft',
  draw: {
    polygon: {
      allowIntersection: true, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    // disable toolbar item by setting it to false
    polyline: false,
    circle: false, // Turns off this drawing tool
    rectangle: false,
    marker: false,
    circlemarker: false
    },
  edit: {
    featureGroup: drawnItems, //REQUIRED!!
    //remove: true
  }
};

L.EditToolbar.Delete.include({
    removeAllLayers: false
});

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);


map.on('draw:created', function(e) {

        drawnItems.clearLayers();

  let type = e.layerType, layer = e.layer;

  if (type === 'polygon') {
    map.addLayer(drawnItems);
    polygonArea =  L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        
    console.log(polygonArea);
    SolarCalc(polygonArea);


  }

  drawnItems.addLayer(layer);
});

map.on("draw:edited", function(e) {
    polygonArea = 0;
    let layers = e.layers;
    layers.eachLayer(function(layer) {
        polygonArea =  L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        
        console.log(polygonArea);
        SolarCalc(polygonArea);
    
    });
  });
  map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
     drawnItems.addLayer(layer);
 });






// Solar Calcualtion Function
function SolarCalc(areaSelected) {
    areaSelected = Math.round(areaSelected)
    let area, panels, systemSize, production, minCaptialCost, maxCapitalCost, minBillSavings, maxBillSavings, co2, trees, driving = 0;
    //Area Card
    document.getElementById('area').innerHTML = areaSelected + " sq.m"
    //No of Panels
    panels = Math.round(areaSelected/2.2);
    document.getElementById('panels').innerHTML =  panels 
    //System Size
    systemSize = Math.round(panels * 365/1000);
    document.getElementById('systemSize').innerHTML =  systemSize + "kW"
    //production : each Panel Produce 290500W/Year based on OpenSolar.com
    production = Math.round(panels * 290500/1000);
    document.getElementById('production').innerHTML =  production + " kWh/y"
    //Capital Cost
    minCaptialCost = Math.round(systemSize * 400);
    maxCaptialCost = Math.round(systemSize * 450);
    
    document.getElementById('capitalCost').innerHTML =   minCaptialCost + " to " + maxCaptialCost + " OMR"
    //Savings
    minbillSavings = Math.round(production * 0.015);
    maxBillSavings = Math.round(production * 0.061);
    document.getElementById('billSavings').innerHTML =   minbillSavings + " to " + maxBillSavings + " OMR"
    
    //CO2
    //https://www.iea.org/data-and-statistics/charts/development-of-co2-emission-intensity-of-electricity-generation-in-selected-countries-2000-2020
    // US ELECTRICITY Market generates 352 gCO2e/kWh
    co2 = Math.round(production * 352/1000000);
    document.getElementById('co2').innerHTML =  co2 + " TONS"


    //Tree   
    //https://www.encon.be/en/calculation-co2-offsetting-trees
    // According to the above website 31.5 kg CO2/tree.
    trees = Math.round(co2/31.5*1000);
    document.getElementById('trees').innerHTML =  trees + " Trees"

    //Driving   
    //https://www.eea.europa.eu/highlights/average-co2-emissions-from-new#:~:text=According%20to%20provisional%20data%20published,grammes%20of%20CO2%20per%20kilometre.
    // 120.4 grammes of CO2 per kilometre
    driving = Math.round(co2*1000000/120.4);
    document.getElementById('driving').innerHTML =  driving + " KM"

}




// let neededPanels = parseInt(area/2.2);
// let installedPower = parseFloat(neededPanels *(400.0/1000.0)).toFixed(1);
// let systemProduction = parseFloat(installedPower * solarYield).toFixed(1);
// let minBillSavings = parseFloat(systemProduction *0.015).toFixed(1);
// let maxBillSavings = parseFloat(systemProduction *0.03).toFixed(1);
// let co2Savings = parseFloat(systemProduction *(0.519/1000)).toFixed(1);
// let minExpectedCost = parseFloat(400 * installedPower).toFixed(1);
// let maxExpectedCost = parseFloat(450 * installedPower).toFixed(1);