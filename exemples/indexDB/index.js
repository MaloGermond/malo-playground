function setup() {
  createCanvas(windowWidth, windowHeight);
  memory.setName('users');
  GUI();
}

function draw() {
  background('#F3F9F7'); // Ajout d'un fond pour éviter les traînées
}

const GUIactions = {
  purge: function () {
    memory.clear();
  },
  create: function () {
    memory.set(setting.key, setting.value, setting.version);
  },
};

let setting = {
  version: 1,
  key: 'Martha',
  value: '31',
};

function GUI() {
  const GUI = lil.GUI;
  const gui = new GUI();

  gui.add(GUIactions, 'purge').name('Purge DB');
  gui.add(GUIactions, 'create').name('Create');
  gui.add(setting, 'key').name('Key');
  gui.add(setting, 'value').name('Value');
  gui.add(setting, 'version', 1, 100, 1).name('Version');
}

function DBget(dbName, key, version = 1) {
  console.info('Opening DB:', dbName, 'Version:', version);

  let request = indexedDB.open(dbName, version);

  request.onsuccess = function (event) {
    let db = event.target.result;
    console.info('DB opened successfully:', dbName);

    let tx = db.transaction(dbName, 'readonly'); // Transaction en lecture seule
    let store = tx.objectStore(dbName);

    let getRequest = store.get(key);

    getRequest.onsuccess = function () {
      if (getRequest.result) {
        console.info('Data retrieved successfully:', getRequest.result);
      } else {
        console.warn('No data found for key:', key);
      }
    };

    getRequest.onerror = function () {
      console.error('Error retrieving data:', getRequest.error);
    };

    tx.oncomplete = function () {
      db.close(); // Ferme la base après la transaction
      console.info('Transaction complete, DB closed.');
    };
  };

  request.onerror = function () {
    console.error('Error opening DB:', request.error);
  };
}
