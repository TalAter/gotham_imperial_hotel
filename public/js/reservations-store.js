var DB_VERSION = 2;
var DB_NAME = "gih-reservations";

// Returns a promise which resolves with a database object if it is  opened
// successfully or rejects with an error message if it didn't.
var openDatabase = function() {
  return new Promise(function (resolve, reject) {
    // Make sure IndexedDB is supported before attempting to use it
    if (!window.indexedDB) {
      reject("IndexedDB not supported");
    }
    var request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = function(event) {
      reject("Database error: " + event.target.error);
    };

    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var upgradeTransaction = event.target.transaction;
      var reservationsStore;
      if (!db.objectStoreNames.contains("reservations")) {
        reservationsStore = db.createObjectStore("reservations",
          { keyPath: "id" }
        );
      } else {
        reservationsStore = upgradeTransaction.objectStore('reservations');
      }

      if (!reservationsStore.indexNames.contains("idx_status")) {
        reservationsStore.createIndex("idx_status", "status", { unique: false });
      }
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
  });
};

// Returns a promise which resolves with an object store object
var openObjectStore = function(db, storeName, transactionMode) {
  return new Promise(function (resolve, reject) {
    var objectStore = db
      .transaction(storeName, transactionMode)
      .objectStore(storeName);
    resolve(objectStore);
  });
};


var addToObjectStore = function(storeName, object) {
  return new Promise(function(resolve, reject) {
    openDatabase().then(function(db) {
      return openObjectStore(db, storeName, 'readwrite');
    }).then(function(objectStore) {
        objectStore.add(object).onsuccess = resolve;
    }).catch(function(errorMessage) {
      reject(errorMessage);
    });
  });
};

var updateInObjectStore = function(storeName, id, object) {
  return new Promise(function(resolve, reject) {
    openDatabase().then(function(db) {
      return openObjectStore(db, storeName, 'readwrite');
    }).then(function(objectStore) {
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (!cursor) {
          reject('Reservation not found in object store');
        }
        if (cursor.value.id === id) {
          cursor.update(object).onsuccess = resolve;
          return;
        }
        cursor.continue();
      };
    }).catch(function(errorMessage) {
      reject(errorMessage);
    });
  });
};

var getReservations = function(indexName, indexValue) {
  return new Promise(function(resolve, reject) {
    openDatabase().then(function(db) {
      return openObjectStore(db, 'reservations');
    }).then(function(objectStore) {
      var reservations = [];
      var cursor;
      if (indexName && indexValue) {
        cursor = objectStore.index(indexName).openCursor(indexValue);
      } else {
        cursor = objectStore.openCursor();
      }
      cursor.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          reservations.push(cursor.value);
          cursor.continue();
        } else {
          if (reservations.length > 0) {
            resolve(reservations);
          } else {
            getReservationsFromServer().then(function(reservations) {
              openDatabase().then(function(db) {
                return openObjectStore(db, 'reservations', 'readwrite');
              }).then(function(objectStore) {
                for (var i = 0; i < reservations.length; i++) {
                  objectStore.add(reservations[i]);
                }
                resolve(reservations);
              });
            });
          }
        }
      };
    }).catch(function(errorMessage) {
      getReservationsFromServer().then(function(reservations) {
        resolve(reservations);
      });
    });
  });
};

var getReservationsFromServer = function() {
  return new Promise(function(resolve, reject) {
    $.getJSON('/reservations.json', resolve);
  });
};
