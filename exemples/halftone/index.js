//
// TO DO
//
// -- bugs --
// - Le lock ratio ne respect pas le ratio. Quand on arrive dans des petits nombre le ratio fait n'importe quoi à cause des approximations
//
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
//
// - Déplacer le fond background damier en même temps que l'on se déplace
// - Fixer le zoom du background damier quand on zoom
// - Faire que l'on puisse zoom en direction du centre de la vue plutôt que de l'artboard.
// - Permettre l'ajout d'un calque pour modifier/cacher la taille des points et/ou la couleur
// - Resize l'artboard quand on resize la fenetre
// - Ajouter la possibilité de copier / coller les images en cours (ajout d'une snackbar ?)
// - Ajouter d'inclure ou non le background dans l'export
// - Ajouter un bouton pour ajouter une image en le cherchant dans le folder plutôt que de glisser / déposer
// - Créer un plugin figma/penpot pour convertir à la volé des images
// - Le gradient se fait que sur la couleur, est-ce qu'il ne faut pas aussi inclure l'opacité pour le cas des dégradés d'opacité ou il y a un fond d'une seul couleur. Peut-être laisser la possibilité de choisir le mode d'interpretation (brigthness, alpha ect)
// - Permettre de randomiser la pose des points pour qu'il n'y ai pas l'effet de sequin
//

let settings = {
  outputWidth: 1080,
  outputHeight: 1080,
  output: {
    backgroundColor: '#fff',
    backgroundOpacity: 100,
  },
  lockRatio: true,
  minDot: 15,
  maxDot: 100,
  spacingX: 10,
  spacingY: 5,
  offset: 0.5,
  dotSize: 12,
  grayscale: false,
  batchSize: 1000, // Taille du traitement par lot
  batchIndex: 0, // Stock l'étape (l'index) du traitement par lot
  distortion: 0, // Add random position to the dot
  exportName: 'untitled',
  src: null, // The image use for generate the halftone.
  artboard: {
    x: 0,
    y: 0,
    zoom: 0.3,
    zoomMin: 0.1,
    zoomMax: 10,
  },
  dbVersion: 0,
};

let isMouseOverGUI = false;

let imageSource;
let imageResult;

let backgroundTile;

function preload() {
  // C'est important de preload l'image car sinon les valeurs de taille de l'image n'ont pas le temps de s'initialiser.
  imageSource = loadImage('./img/Mathou 1.png');
}

function setup() {
  console.warn('🌡️ Pensez à désactiver Add block pour ameliorer les performances !');

  // Charger les cookies
  const artboard = createCanvas(windowWidth, windowHeight);
  artboard.drop(handleDrop);
  artboard.mouseWheel(handleNavigation);

  loadMemory();

  loadGUI();

  // Placer au centre l'image
  settings.artboard.x = windowWidth / 2;
  settings.artboard.y = windowHeight / 2;

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

function createTransparentTile() {
  const size = 256;
  const squareNumber = 32;
  const squareSize = size / squareNumber;

  // Supprimer l'ancien buffer s'il existe
  if (backgroundTile) {
    // je check si la tuile existe deja. Si oui pas besoin d'en crée une nouvelle. Par contre si je veux pouvoir changer la couleur il va faloir faire des modifications ici.
    return backgroundTile;
    backgroundTile.remove();
  }

  backgroundTile = createGraphics(size, size);

  backgroundTile.noStroke();

  for (let y = 0; y < size; y += squareSize) {
    for (let x = 0; x < size; x += squareSize) {
      backgroundTile.fill(0, 0, 0, (x / squareSize + y / squareSize) % 2 == 0 ? 50 : 100);
      backgroundTile.rect(x, y, squareSize, squareSize);
    }
  }

  return backgroundTile;
}

function drawTransparentGrid(zoom) {
  const tile = createTransparentTile();

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
    deleteDB('imageStore');
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

  settings.dbVersion += 1;
  saveToDB('imageStore', settings.dbVersion, imageSource.canvas.toDataURL());

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

async function loadMemory() {
  // Initialisation de settings dans local storage. Ne charge rien
  if (localStorage.settings === undefined) {
    return;
  }

  settings = JSON.parse(localStorage.settings);

  if (settings.dbVersion > 0) {
    try {
      // Attend que loadFromDB récupère les données avant de continuer
      const imgBase64 = await loadFromDB('imageStore', settings.dbVersion);

      console.log(imageSource);
      // imageSource = loadImage(imgBase64);

      // Vérifie si on a bien une image à charger
      if (imgBase64) {
        loadImage(imgBase64, (img) => {
          console.log('Image loaded');
          imageSource = img;
        });
        console.log(imageSource);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  console.log('Memory loaded');
}

function updateMemory() {
  localStorage.setItem('settings', JSON.stringify(settings));
  console.log('Memory stored');
  // console.log(localStorage)
}

//
// IndexedDB
//

//imageSource.canvas.toDataURL()
//saveToDB('imageStore', 1,imageSource.canvas.toDataURL()  )

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

// loadFromDB('imageStore')

// Fonction modifiée loadFromDB pour retourner une promise
function loadFromDB(storeName = 'default', version = 1, id = 1) {
  return new Promise((resolve, reject) => {
    // Ouvre une base de données avec le nom 'storeName' et la version 'version'
    let request = indexedDB.open(storeName, version);

    request.onsuccess = function () {
      // Lorsque la base de données est ouverte avec succès, cette fonction est appelée
      let db = request.result; // Récupère l'instance de la base de données

      // Commence une transaction avec le store en mode lecture ('readonly')
      let tx = db.transaction(storeName, 'readonly');

      // Accède à l'object store du nom spécifié
      let store = tx.objectStore(storeName);

      // Demande la lecture de l'élément avec id
      let getRequest = store.get(id);

      getRequest.onsuccess = function () {
        // Lorsque l'élément est récupéré avec succès
        let result = getRequest.result;

        if (result) {
          console.info('Données récupérées :', { result });
          resolve(result.data); // Résout la promise avec les données
        } else {
          console.info("Aucune donnée trouvée pour l'id ", id);
          resolve(null); // Résout la promise avec null si pas de données
        }
      };

      getRequest.onerror = function () {
        console.error('Erreur lors de la récupération des données');
        reject('Erreur lors de la récupération des données'); // Rejette la promise en cas d'erreur
      };
    };

    request.onerror = function () {
      console.error("Erreur lors de l'ouverture de la base de données");
      reject("Erreur lors de l'ouverture de la base de données"); // Rejette la promise en cas d'erreur
    };
  });
}

function deleteDB(dbName) {
  let request = indexedDB.deleteDatabase(dbName);

  request.onsuccess = function () {
    console.log('Database deleted successfully');
  };

  request.onerror = function (event) {
    console.error('Error deleting the database:', event.target.error);
  };

  request.onblocked = function () {
    console.warn('Database deletion is blocked. Close all connections to the database.');
  };
}
