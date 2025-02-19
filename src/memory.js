const memory = (function () {
  let dbName = 'default';

  function name(value) {
    if (typeof value != 'string') {
      console.error('is not a String. Provied a string to name database', { value });
    }

    dbName = value;
  }

  // Create and update
  function set(key, value) {}

  // Read
  function get(key) {}

  // Delete
  function clear(key) {}

  // Supprime la base de donné
  function purge() {
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

  return {
    name,
    set,
    get,
    clear,
    purge,
  };
})();
