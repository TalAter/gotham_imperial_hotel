var DB_VERSION = 2;
var DB_NAME = "gih-reservations";

var openDatabase = function() {
  return new Promise(function(resolve, reject) {
    // Make sure IndexedDB is supported before attempting to use it
    if (!self.indexedDB) {
      reject("IndexedDB not supported");
    }
    var request = self.indexedDB.open(DB_NAME, DB_VERSION);
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
        reservationsStore = upgradeTransaction.objectStore("reservations");
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

var openObjectStore = function(db, storeName, transactionMode) {
  return db
    .transaction(storeName, transactionMode)
    .objectStore(storeName);
};

var addToObjectStore = function(storeName, object) {
  return new Promise(function(resolve, reject) {
    openDatabase().then(function(db) {
      openObjectStore(db, storeName, "readwrite")
        .add(object).onsuccess = resolve;
    }).catch(function(errorMessage) {
      reject(errorMessage);
    });
  });
};

var updateInObjectStore = function(storeName, id, object) {
  return new Promise(function(resolve, reject) {
    openDatabase().then(function(db) {
      openObjectStore(db, storeName, "readwrite")
        .openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (!cursor) {
            reject("Reservation not found in object store");
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
  return new Promise(function(resolve) {
    openDatabase().then(function(db) {
      var objectStore = openObjectStore(db, "reservations");
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
                var objectStore = openObjectStore(db, "reservations", "readwrite");
                for (var i = 0; i < reservations.length; i++) {
                  objectStore.add(reservations[i]);
                }
                resolve(reservations);
              });
            });
          }
        }
      };
    }).catch(function() {
      getReservationsFromServer().then(function(reservations) {
        resolve(reservations);
      });
    });
  });
};

var getReservationsFromServer = function() {
  return new Promise(function(resolve) {
    if (self.$) {
      $.getJSON("/reservations.json", resolve);
    } else if (self.fetch) {
      fetch("/reservations.json").then(function(response) {
        return response.json();
      }).then(function(reservations) {
        resolve(reservations);
      });
    }
  });
};
