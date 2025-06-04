const memory = (function () {
  let dbName = 'untilted';
  let version = 1;
  let verbose = false;

  function setName(value) {
    if (typeof value != 'string') {
      console.error('is not a String. Provied a string to name database', { value });
    }
    dbName = value;
  }

  function getName() {
    return dbName;
  }

  async function init(dbName, version = 1) {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbName, version);

      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        verbose ? console.info('Upgrade needed for DB:', dbName) : null;

        if (!db.objectStoreNames.contains(dbName)) {
          db.createObjectStore(dbName, { keyPath: 'id' });
          verbose ? console.info('Object store created:', dbName) : null;
        }
      };

      request.onsuccess = function (event) {
        let db = event.target.result;
        db.close();
        resolve();
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  // Create and update
  function set(key, value, version = 1) {
    verbose ? console.info('Opening DB:', dbName, 'Version:', version) : null;

    let request = indexedDB.open(dbName, version);

    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      verbose ? console.info('Upgrade needed for DB:', dbName) : null;

      if (!db.objectStoreNames.contains(dbName)) {
        db.createObjectStore(dbName, { keyPath: 'id' });
        verbose ? console.info('Object store created:', dbName) : null;
      }
    };

    request.onsuccess = function (event) {
      let db = event.target.result;
      verbose ? console.info('DB opened successfully:', dbName) : null;

      let tx = db.transaction(dbName, 'readwrite');
      let store = tx.objectStore(dbName);

      let putRequest = store.put({ id: key, data: value });

      putRequest.onsuccess = function () {
        verbose ? console.info('Data saved successfully:', key, value) : null;
      };

      putRequest.onerror = function () {
        console.error('Error saving data:', putRequest.error);
      };

      tx.oncomplete = function () {
        db.close(); // ⚠️ Ferme la base après la transaction pour éviter les blocages
        verbose ? console.info('Transaction complete, DB closed.') : null;
      };
    };

    request.onerror = function () {
      console.error('Error opening DB:', request.error);
    };

    request.onblocked = function () {
      console.warn('DB upgrade blocked! Close all tabs using this DB.');
    };
  }

  // Read
  async function get(key, version = 1) {
    // On S'assure que le store existe avant de faire la recherche.
    await init(dbName, version);

    return new Promise((resolve, reject) => {
      verbose ? console.info('Opening DB:', dbName, 'Version:', version) : null;

      let request = indexedDB.open(dbName, version);

      request.onsuccess = function (event) {
        let db = event.target.result;
        verbose ? console.info('DB opened successfully:', dbName) : null;

        let tx = db.transaction(dbName, 'readonly');
        let store = tx.objectStore(dbName);
        let getRequest = store.get(key);

        getRequest.onsuccess = function () {
          if (getRequest.result) {
            verbose ? console.info('Data retrieved successfully:', getRequest.result) : null;
            resolve(getRequest.result); // Renvoie la donnée
          } else {
            console.warn('No data found for key:', key);
            db.close();
            resolve(null); // Renvoie `null` si aucune donnée trouvée
          }
        };

        getRequest.onerror = function () {
          console.error('Error retrieving data:', getRequest.error);
          reject(getRequest.error); // Rejette l'erreur
        };

        tx.oncomplete = function () {
          db.close();
          verbose ? console.info('Transaction complete, DB closed.') : null;
        };
      };

      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        verbose ? console.info('Upgrade needed for DB:', memory.dbName) : null;

        if (!db.objectStoreNames.contains(memory.dbName)) {
          db.createObjectStore(memory.dbName, { keyPath: 'id' });
          verbose ? console.info('Object store created:', memory.dbName) : null;
        }
      };

      request.onerror = function () {
        console.error('Error opening DB:', request.error);
        reject(request.error); // Rejette l'erreur si la DB ne s'ouvre pas
      };
    });
  }

  // Delete
  function clear(key = dbName) {
    let request = indexedDB.deleteDatabase(key);

    request.onsuccess = function () {
      verbose ? console.info('Database deleted successfully') : null;
    };

    request.onerror = function (event) {
      console.error('Error deleting the database:', event.target.error);
    };

    request.onblocked = function () {
      console.warn('Database deletion is blocked. Close all connections to the database.');
    };
  }

  return {
    setName,
    getName,
    set,
    get,
    clear,
  };
})();
