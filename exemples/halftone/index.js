//
// TO DO
//
// - Ajouter un mode demi-ton noir et blanc avec gestion du seuil de luminosité (prio 1)
// - Sauvegarder l’image lors du rechargement de la page (prio 1)
// - Optimiser les performances du rendu en demi-ton (prio 1)
// - Rendre possible le rendu d’images très grandes en traitement par batch (prio 1)
// - Ajouter des options de modification de l’image source (contraste, point noir, point blanc) -> C'est une lib ca (prio 1)
//
// - Permettre de choisir la couleur de fond lors de l’exportation de l’image (prio 2)
// - Ajouter la possibilité d’exporter uniquement un canal spécifique (prio 2)
// - Permettre l’exportation en CMJN ou en un nombre défini de couleurs (prio 2)
// - Gérer le drop d’image en affichant une info lors du survol (prio 2)
// - Permettre de choisir autre chose qu’un point (croix, carré…) pour le rendu (prio 2)
// - Améliorer la gestion des ratios d’image (prio 2)
//
// - Analyser et afficher les performances CPU (prio 3)
// - Ajouter une option pour faire une rotation la grille (prio 3)
// - Déplacer le fond background damier en même temps que l'on se déplace
// - Fixer le zoom du background damier quand on zoom
// - Faire que l'on puisse zoom en direction du centre de la vue plutôt que de l'artboard.
// - Permettre l'ajout d'un calque pour modifier/cacher la taille des points et/ou la couleur
//
//
//

let settings = {
  outputWidth: 500,
  outputHeight: 500,
  output: {
    backgroundColor: '#fff',
    backgroundOpacity: 100,
  },
  lockRatio: true,
  minDot: 10,
  maxDot: 100,
  spacingX: 10,
  spacingY: 5,
  offset: 0.5,
  dotSize: 30,
  grayscale: true,
  batchSize: 1000, // Taille du traitement par lot
  batchIndex: 0, // Stock l'étape (l'index) du traitement par lot
  distortion: 0, // Add random position to the dot
  exportName: 'untitled',
  src: null, // The image use for generate the halftone.
  artboard: {
    x: 0,
    y: 0,
    zoom: 1,
    zoomMin: 0.1,
    zoomMax: 10,
  },
  dbVersion: 1,
};

let isMouseOverGUI = false;

let imageSource;
let imageResult;

function preload() {
  // C'est important de preload l'image car sinon les valeurs de taille de l'image n'ont pas le temps de s'initialiser.
  imageSource = loadImage('./img/Mathou 1.png');
}

function setup() {
  // Charger les cookies
  const artboard = createCanvas(windowWidth, windowHeight);
  artboard.drop(handleDrop);
  artboard.mouseWheel(handleNavigation);

  // Placer au centre l'image
  settings.artboard.x = windowWidth / 2;
  settings.artboard.y = windowHeight / 2;

  loadMemory();
  loadGUI();
  imageResult = halftone.render(imageSource, settings);
}

function draw() {
  clear();

  drawTransparentGrid(settings.artboard.zoom);

  drawRenderLayer();

  drawPreviewImageSource();
}

function mouseDragged() {
  if (isMouseOverGUI) {
    return;
  }
}

//
//  GENERAL FUNCTIOIN
//

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

//
// ARTBOARD
//

function handleNavigation(event) {
  // keyCode for cmd == 91

  // Pressed cmd and scroll vertical to zoom
  if (keyIsDown(91)) {
    const zoomChange = round(
      clamp(
        settings.artboard.zoom - event.deltaY * 0.01,
        settings.artboard.zoomMin,
        settings.artboard.zoomMax
      ),
      2
    );

    settings.artboard.zoom = zoomChange;
  } else {
    const scaledImageWidth = settings.outputWidth * settings.artboard.zoom;
    const scaledImageHeight = settings.outputHeight * settings.artboard.zoom;

    // clamp is here to had some hard limite to paneling and avoir to lost the content.

    settings.artboard.x = clamp(
      settings.artboard.x - event.deltaX,
      -scaledImageWidth / 2,
      windowWidth + scaledImageWidth / 2
    );
    settings.artboard.y = clamp(
      settings.artboard.y - event.deltaY,
      -scaledImageHeight / 2,
      windowHeight + scaledImageHeight / 2
    );
  }
}

function createTransparentGrid() {
  const size = 256;
  const squareNumber = 32;
  const squareSize = size / squareNumber;

  const tile = createGraphics(size, size);

  tile.noStroke();

  for (let y = 0; y < size; y += squareSize) {
    for (let x = 0; x < size; x += squareSize) {
      tile.fill(0, 0, 0, (x / squareSize + y / squareSize) % 2 == 0 ? 50 : 100);
      tile.rect(x, y, squareSize, squareSize);
    }
  }

  return tile;
}

function drawTransparentGrid(zoom) {
  const tile = createTransparentGrid();

  const size = map(zoom, 0.1, 10, 256, 2048, true);

  for (let y = 0; y < windowHeight; y += size) {
    for (let x = 0; x < windowWidth; x += size) {
      image(tile, x, y, size, size);
    }
  }
}

//
// HALFTONE
//

function drawRenderLayer() {
  push();
  translate(settings.artboard.x, settings.artboard.y);
  scale(settings.artboard.zoom);
  imageMode(CENTER);
  rectMode(CENTER);

  image(imageResult, 0, 0, settings.outputWidth, settings.outputHeight);

  // Create a rectangle around the image
  stroke('#0C8CE9');
  noFill();
  rect(-1, -1, settings.outputWidth + 2, settings.outputHeight + 2);
  pop();
}

function drawPreviewImageSource(width = 200) {
  const ratio = imageSource.height / imageSource.width;
  push();
  image(imageSource, 0, 0, width, width * ratio);
  pop();
}

function render() {
  updateMemory();
  imageResult = halftone.render(imageSource, settings);
}

function exportSVG() {
  const svg = halftone.render(imageSource, settings, 'SVG');

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  // Get the SVG content as a string

  const blob = new Blob([source], { type: 'text/plain' });
  const a = document.createElement('a');

  a.href = URL.createObjectURL(blob);
  a.download = settings.exportName + '.svg';
  a.click();

  URL.revokeObjectURL(a.href); // Clean up
}

//
// Lil-gui Management
//

const GUIactions = {
  savePNG: function () {
    saveCanvas(imageResult, settings.exportName, 'png');
  },
  saveSVG: function () {
    exportSVG();
  },
  clearStorage: function () {
    localStorage.clear();
  },
  newFile: function () {
    localStorage.clear();
    location.reload();
  },
};

function loadGUI() {
  const GUI = lil.GUI;
  const gui = new GUI();

  gui.domElement.addEventListener('mouseenter', () => (isMouseOverGUI = true));
  gui.domElement.addEventListener('mouseleave', () => (isMouseOverGUI = false));

  const output = gui.addFolder('Image Parameters');
  const artboard = gui.addFolder('Artboard');
  const pattern = gui.addFolder('Pattern');
  const guiExport = gui.addFolder('Export');

  gui.title('Settings');

  // New file
  gui.add(GUIactions, 'newFile').name('New');

  // ZOOM Management
  artboard
    .add(settings.artboard, 'zoom', settings.artboard.zoomMin, settings.artboard.zoomMax, 0.05)
    .listen();

  // OUTPUT Values
  output
    .add(settings, 'outputWidth')
    .listen()
    .onChange((value) => {
      if (settings.lockRatio) {
        const ratio = Math.round(settings.outputHeight / settings.outputWidth);
        settings.outputHeight = Math.max(Math.round(value * ratio), 50);
      }
      render();
    });
  output
    .add(settings, 'outputHeight')
    .listen()
    .onChange((value) => {
      if (settings.lockRatio) {
        const ratio = Math.round(settings.outputHeight / settings.outputWidth);
        settings.outputWidth = Math.max(Math.round(value * ratio), 50);
      }
      render();
    });
  output.add(settings, 'lockRatio').onChange((value) => {
    render();
  });
  output
    .addColor(settings.output, 'backgroundColor')
    .name('Background Color')
    .onChange((value) => {
      render();
    });
  output
    .add(settings.output, 'backgroundOpacity', 0, 254, 1)
    .name('Background Opacity')
    .onChange((value) => {
      render();
    });

  // GRID CONTROLE
  pattern
    .add(settings, 'dotSize', 0.1, 60, 0.1)
    .name('Dots size')
    .onChange((value) => {
      render();
    });
  pattern
    .add(settings, 'minDot', 0, 100, 0.1)
    .name('Min size')
    .onChange((value) => {
      render();
    });
  pattern
    .add(settings, 'maxDot', 0, 100, 0.1)
    .name('Max size')
    .onChange((value) => {
      render();
    });

  pattern.add(settings, 'distortion', 0, 10).onChange((value) => {
    render();
  });

  pattern.add(settings, 'spacingX', 1, 100, 0.01).onChange((value) => {
    render();
  });
  pattern.add(settings, 'spacingY', 1, 100, 0.01).onChange((value) => {
    render();
  });
  pattern.add(settings, 'offset', 0, 1, 0.01).onChange((value) => {
    render();
  });

  // GRID COLORS
  pattern.add(settings, 'grayscale').onChange((value) => {
    render();
  });

  // RESSOURCES MANAGEMENT
  // gui.add( settings, 'batchSize').onChange( value => {render()})
  // gui.add( settings, 'batchIndex').onChange( value => {render()})

  // EXPORT CONTROLE
  guiExport.add(settings, 'exportName').name('File name').onChange(updateMemory());
  guiExport.add(GUIactions, 'savePNG').name('.png');
  guiExport.add(GUIactions, 'saveSVG').name('.svg');
}

function handleDrop(file) {
  if (file.type != 'image') {
    return;
  }

  loadImage(file.data, (img) => {
    imageSource = img;

    const ratio = imageSource.height / imageSource.width;
    settings.outputHeight = settings.outputWidth * ratio;
    render();
  });
}

//
// MEMORY MANAGEMENT
//

// L'idée de cette fonction c'est de gerer les cookies et de conserver la session de travail. Donc je vais sauvegarder en deux cookies (ou plus) les informations de la session. Les settings (les reglages) et l'image sources utiliser. Donc il faut checker si l'une ou l'autre des valeurs existe et la remplacer dans le cas ou elle n'existe par pour une durée (de 30jours?)

// Il faut aussi une autre fonction qui à chaque changement ou tout les n (minutes) met à jours les cookies.

function loadMemory() {
  // Inicialisation de settings dans local storage. Ne charge rien
  if (localStorage.settings === undefined) {
    return;
  }

  settings = JSON.parse(localStorage.settings);

  console.log('Memory loaded');
}

function updateMemory() {
  localStorage.setItem('settings', JSON.stringify(settings));
  // localStorage.setItem("imageSource", imageSource.pixels)
  console.log('Memory stored');
  // console.log(localStorage)
}

//
// IndexedDB
//

//imageSource.canvas.toDataURL()
//saveToDB('image', 1,imageSource.canvas.toDataURL()  )

function saveToDB(storeName = 'default', version = 1, value) {
  // Ouvre une base de données avec le nom 'storeName' et la version 'version'
  let request = indexedDB.open(storeName, version);

  request.onupgradeneeded = function () {
    // Lorsque la base de données est créée ou mise à jour, cette fonction est appelée
    let db = request.result; // Récupère l'instance de la base de données

    // Crée un object store dans la base de données. Le nom est 'storeName' (par défaut 'test')
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: 'id' });
    }
  };

  request.onsuccess = function () {
    // Lorsque la base de données est ouverte avec succès, cette fonction est appelée
    let db = request.result; // Récupère l'instance de la base de données

    // Commence une transaction avec le store 'storeName' en mode 'readwrite'
    let tx = db.transaction(storeName, 'readwrite'); // Le nom du store est 'storeName' (pas 'store')

    // Problème ici : tu utilises à nouveau le nom 'store', qui fait référence à la variable du paramètre et à la variable de la transaction
    let store = tx.objectStore(storeName); // Cette ligne pose problème car le nom de la variable est le même que le paramètre 'storeName', créant une confusion

    // On insère des données dans le store en utilisant un objet avec un id et les données à insérer
    store.put({ id: 1, data: value }); // Ajoute un élément avec id 1 et les données passées à la fonction
  };
}

// loadFromDB('image')

function loadFromDB(storeName = 'default', version = 1, id = 1) {
  // Ouvre une base de données avec le nom 'storeName' et la version 'version'
  let request = indexedDB.open(storeName, version);

  request.onsuccess = function () {
    // Lorsque la base de données est ouverte avec succès, cette fonction est appelée
    let db = request.result; // Récupère l'instance de la base de données

    // Commence une transaction avec le store en mode lecture ('readonly')
    let tx = db.transaction(storeName, 'readonly');

    // Accède à l'object store du nom spécifié
    let store = tx.objectStore(storeName);

    // Demande la lecture de l'élément avec id = 1 (on suppose que l'id est 1 pour cet exemple)
    let getRequest = store.get(id);

    getRequest.onsuccess = function () {
      // Lorsque l'élément est récupéré avec succès
      let result = getRequest.result;

      if (result) {
        console.log('Données récupérées :', result.data); // Affiche les données de l'élément avec id = 1
        return result.data; // Retourne les données de l'élément
      } else {
        console.log("Aucune donnée trouvée pour l'id ", id);
        return null; // Si aucune donnée n'est trouvée
      }
    };

    getRequest.onerror = function () {
      console.error('Erreur lors de la récupération des données');
      return null; // Si une erreur se produit
    };
  };

  request.onerror = function () {
    console.error("Erreur lors de l'ouverture de la base de données");
    return null; // Si une erreur se produit lors de l'ouverture de la base de données
  };
}
