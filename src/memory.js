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

  // Create and update
  function set(key, value, version = 1) {
    console.info('Opening DB:', dbName, 'Version:', version);

    let request = indexedDB.open(dbName, version);

    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      console.info('Upgrade needed for DB:', dbName);

      if (!db.objectStoreNames.contains(dbName)) {
        db.createObjectStore(dbName, { keyPath: 'id' });
        console.info('Object store created:', dbName);
      }
    };

    request.onsuccess = function (event) {
      let db = event.target.result;
      console.info('DB opened successfully:', dbName);

      let tx = db.transaction(dbName, 'readwrite');
      let store = tx.objectStore(dbName);

      let putRequest = store.put({ id: key, data: value });

      putRequest.onsuccess = function () {
        console.info('Data saved successfully:', key, value);
      };

      putRequest.onerror = function () {
        console.error('Error saving data:', putRequest.error);
      };

      tx.oncomplete = function () {
        db.close(); // ⚠️ Ferme la base après la transaction pour éviter les blocages
        console.info('Transaction complete, DB closed.');
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
  function get(key, version = 1) {
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

  // Delete
  function clear(key = dbName) {
    let request = indexedDB.deleteDatabase(key);

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

  return {
    setName,
    getName,
    set,
    get,
    clear,
  };
})();
