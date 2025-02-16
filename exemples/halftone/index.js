
let settings = {
  outputWidth: 500,
  outputHeight: 500,
  imageRatio: true,
  minDot: 0,
  maxDot: 1,
  spacingX: 10,
  spacingY: 10,
  offset: 5,
  dotSize: 5,
  grayscale: true,
  batchSize: 1000, // Taille du traitement par lot
  batchIndex: 0, // Stock l'étape (l'index) du traitement par lot
  distortion: 0, // Add random position to the dot
  src: null, // The image use for generate the halftone.
  artboard:{
    x:0,
    y:0,
    zoom:1,
  }
}


let imageSource
let imageResult

function preload(){
  // C'est important de preload l'image car sinon les valeurs de taille de l'image n'ont pas le temps de s'initialiser.
  imageSource = loadImage('./img/Mathou 1.png')
}

function setup() {
  // Charger les cookies
  const artboard = createCanvas(windowWidth, windowHeight);
  artboard.drop(handleDrop);

  loadMemory()
  loadGUI()
  imageResult = halftone.render(imageSource,settings)
}

function draw(){
  clear();

  push()
  translate(settings.artboard.x,settings.artboard.y)
  scale(settings.artboard.zoom)
  imageMode(CENTER);
  image(imageResult,0,0,settings.outputWidth,settings.outputHeight)
  pop()

  imageMode(CORNER);
  image(imageSource,0,0,200,200)
  
}

function mouseDragged(){
  settings.artboard.x += movedX
  settings.artboard.y += movedY
}

//
// Haltone
//

function render(){
  updateMemory()
  imageResult = halftone.render(imageSource, settings)
}

//
// Lil-gui Management
//

const GUIactions = {
    savePNG : function() {saveCanvas(imageResult,'untitled','png')},
    clearStorage : function() {localStorage.clear()}
  }

function loadGUI(){
  const GUI = lil.GUI;
  const gui = new GUI();


  gui.add( settings.artboard, 'zoom',0.1,10,0.05)

  gui.add( settings, 'outputWidth').listen().onChange( value => {
    if(settings.imageRatio) {
      const ratio = Math.round(settings.outputHeight / settings.outputWidth)
      settings.outputHeight = value * ratio
    }
    render()})
  gui.add( settings, 'outputHeight').listen().onChange( value => {
    if(settings.imageRatio) {
      const ratio = Math.round(settings.outputHeight / settings.outputWidth)
      settings.outputWidth = Math.round(value * ratio)
    }
    render()})
  gui.add( settings, 'imageRatio').onChange( value => {render()})

  gui.add( settings, 'minDot',0.1,100).onChange( value => {render()})
  gui.add( settings, 'maxDot',0.1,100).onChange( value => {render()})

  gui.add( settings, 'spacingX',1,100).onChange( value => {render()})
  gui.add( settings, 'spacingY',1,100).onChange( value => {render()})
  gui.add( settings, 'offset', 0,0.1).onChange( value => {render()})

  gui.add( settings, 'dotSize',0.1,40).onChange( value => {render()})
  gui.add( settings, 'distortion',0,10).onChange( value => {render()})

  gui.add( settings, 'grayscale').onChange( value => {render()})

  gui.add( settings, 'batchSize').onChange( value => {render()})
  gui.add( settings, 'batchIndex').onChange( value => {render()})

  gui.add( GUIactions, 'savePNG').name("Save")
   gui.add( GUIactions, 'clearStorage').name("Reset")


}


function handleDrop(file) {
  if(file.type != "image") {
    return
  }

  imageSource = loadImage(file.data);
  render()
}



//
// MEMORY MANAGEMENT
//

// L'idée de cette fonction c'est de gerer les cookies et de conserver la session de travail. Donc je vais sauvegarder en deux cookies (ou plus) les informations de la session. Les settings (les reglages) et l'image sources utiliser. Donc il faut checker si l'une ou l'autre des valeurs existe et la remplacer dans le cas ou elle n'existe par pour une durée (de 30jours?)

// Il faut aussi une autre fonction qui à chaque changement ou tout les n (minutes) met à jours les cookies.

function loadMemory(){
  // if(getCookie("settings")){
  //   settings = JSON.parse(getCookie("settings"))
  // }
  if(localStorage.settings!==undefined){
    settings = JSON.parse(localStorage.settings)
  }
  console.log("Memory loaded")
  // console.log(settings)

}

function updateMemory(){

  localStorage.setItem("settings", JSON.stringify(settings))
  // localStorage.setItem("imageSource", imageSource.pixels)
  console.log("Memory stored")
  // console.log(localStorage)

  
}

//
//   Plus besoin des cookies je passe par le local storage
//

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convertir jours en millisecondes
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null; // Retourne null si le cookie n'existe pas
}

function clearAllCookies() {
  document.cookie.split(";").forEach((cookie) => {
    let name = cookie.split("=")[0].trim();
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
}



