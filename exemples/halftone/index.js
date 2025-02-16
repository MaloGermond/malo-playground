
// TO DO
//
// - Use lil-gui for UI https://lil-gui.georgealways.com/
//

let session = {}

let defautlSettings = {
  imageWidth: 500,
  imageHeight: 500,
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
  distortion: 0 // Add random position to the dot
}

let imageSource
let imageResult

function preload(){
  // C'est important de preload l'image car sinon les valeurs de taille de l'image n'ont pas le temps de s'initialiser.
  imageSource = loadImage('./img/Mathou 1.png')
}

function setup() {
  
  // Charge les cookies
  cookieInitialisation()
  imageResult = halftone.render(imageSource,session.settings)
  var GUI = lil.GUI;
  const gui = new GUI();
gui.add( document, 'title' );
  
}

function draw(){
  createCanvas(windowWidth, windowHeight);
  clear();
  image(imageSource,0,0,200,200)
  image(imageResult,0,200,200,200)
  

}

//
// Lil-gui Management
//

//
// COOKIE MANAGEMENT
//

// L'idée de cette fonction c'est de gerer les cookies et de conserver la session de travail. Donc je vais sauvegarder en deux cookies (ou plus) les informations de la session. Les settings (les reglages) et l'image sources utiliser. Donc il faut checker si l'une ou l'autre des valeurs existe et la remplacer dans le cas ou elle n'existe par pour une durée (de 30jours?)

// Il faut aussi une autre fonction qui à chaque changement ou tout les n (minutes) met à jours les cookies.

function cookieInitialisation(){
  // Là le code est fait trop vite.
  // Il faut que je fasse une sous fonction qui check et me retourne un TRUE/FALSE et que je remplace par la variable souhaiter ou que j'utilise la variable existante.
  // isExisting -> true -> je remplace settings et imgSource par les valeurs
  // isExisting -> false -> je fait rien
  if(getCookie("settings")===null){
    const cookieSettings = JSON.stringify(defautlSettings)
    
    console.log("Store session")
    setCookie("settings",cookieSettings,30)
  }

  settings = JSON.parse(getCookie("settings"))
  session = {
    "settings":settings
  }
  console.log(settings)
  
}

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



