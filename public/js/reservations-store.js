var DB_VERSION = 2;
var DB_NAME = "gih-reservations";

// Open a request to open a database, and return that request
var openDatabase = function() {
  // Make sure IndexedDB is supported before attempting to use it
  if (!this.indexedDB) {
    return false;
  }

  var request = this.indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = function(event) {
    console.log("Database error: ", event.target.error);
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

  return request;
};

var openObjectStore = function(storeName, successCallback, transactionMode) {
  var db = openDatabase();
  if (!db) {
    return false;
  }
  db.onsuccess = function(event) {
    var db = event.target.result;
    var objectStore = db
      .transaction(storeName, transactionMode)
      .objectStore(storeName);
    successCallback(objectStore);
  };
  return true;
};

var addToObjectStore = function(storeName, object) {
  openObjectStore(storeName, function(store) {
    store.add(object);
  }, "readwrite");
};

var updateInObjectStore = function(storeName, id, object) {
  openObjectStore(storeName, function(objectStore) {
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (!cursor) { return; }
      if (cursor.value.id === id) {
        cursor.update(object);
        return;
      }
      cursor.continue();
    };
  }, "readwrite");
};

var getReservations = function(successCallback) {
  var reservations = [];
  var db = openObjectStore("reservations", function(objectStore) {
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
            openObjectStore("reservations", function(reservationsStore) {
              for (var i = 0; i < reservations.length; i++) {
                reservationsStore.add(reservations[i]);
              }
              successCallback(reservations);
            }, "readwrite");
          });
        }
      }
    };
  });
  if (!db) {
    getReservationsFromServer('/reservations.json', successCallback);
  }
};

var getReservationsFromServer = function(successCallback) {
  $.getJSON('/reservations.json', successCallback);
};
