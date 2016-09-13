var DB_VERSION = 1;
var DB_NAME = "gih-reservations";

// Returns a promise which resolves with a database object if it is  opened
// successfully or rejects with an error message if it didn't.
var openDatabase = function() {
  return new Promise(function (resolve, reject) {
    // Make sure IndexedDB is supported before attempting to use it
    if (!this.indexedDB) {
      reject("IndexedDB not supported");
    }
    var request = this.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = function(event) {
      reject("Database error: " + event.target.error);
    };

    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      if (!db.objectStoreNames.contains("reservations")) {
        db.createObjectStore("reservations",
          { keyPath: "id" }
        );
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

var getReservations = function(successCallback) {
  openDatabase().then(function(db) {
    return openObjectStore(db, 'reservations');
  }).then(function(objectStore) {
    var reservations = [];
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        reservations.push(cursor.value);
        cursor.continue();
      } else {
        if (reservations.length > 0) {
          successCallback(reservations);
        } else {
          getReservationsFromServer(function(reservations) {
            openDatabase().then(function(db) {
              return openObjectStore(db, 'reservations', 'readwrite');
            }).then(function(objectStore) {
              for (var i = 0; i < reservations.length; i++) {
                objectStore.add(reservations[i]);
              }
              successCallback(reservations);
            });
          });
        }
      }
    };
  }).catch(function(errorMessage) {
    getReservationsFromServer('/reservations.json', successCallback);
  });
};

var getReservationsFromServer = function(successCallback) {
  $.getJSON('/reservations.json', successCallback);
};
