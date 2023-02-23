let openDatabase = function () {
	// Makes sure indexDb is supporter by browser before attempting to use it.
	if (!window.indexedDB) {
		return false;
	}

	let request = window.indexedDB.open("gih-reservations", 1);

	request.onerror = function (event) {
		console.log("Database error: ", event.target.error);
	};

	request.onupgradeneeded = function (event) {
		var db = event.target.result;
		if (!db.objectStoreNames.contains("reservations")) {
			db.createObjectStore("reservations", {
				keyPath: "id",
			});
		}
	};
	return request;
};

let openObjectStore = function (storeName, successCallback, transactionMode) {
	var db = openDatabase();
	if (!db) {
		return false;
	}

	db.onsuccess = function (event) {
		var db = event.target.result;
		var objectStore = db
			.transaction(storeName, transactionMode)
			.objectStore(storeName);
		successCallback(objectStore);
	};

	return true;
};

let addToObjectStore = function (storeName, object) {
	openObjectStore(
		storeName,
		function (store) {
			store.add(object);
		},
		"readwrite"
	);
};

var updateInObjectStore = function (storeName, id, object) {
	openObjectStore(
		storeName,
		function (objectStore) {
			objectStore.openCursor().onsuccess = function (event) {
				var cursor = event.target.result;
				if (!cursor) {
					return;
				}
				if (cursor.value.id === id) {
					cursor.update(object);
					return;
				}
				cursor.continue();
			};
		},
		"readwrite"
	);
};

let getReservations = function (successCallback) {
	var reservations = [];
	var db = openObjectStore("reservations", function (objectStore) {
		objectStore.openCursor().onsuccess = function (event) {
			var cursor = event.target.result;
			if (cursor) {
				reservations.push(cursor.value);
				cursor.continue();
			} else {
				if (reservations.length > 0) {
					successCallback(reservations);
				} else {
					$.getJSON("/reservations.json", function (reservations) {
						openObjectStore(
							"reservations",
							function (reservationsStore) {
								for (var i = 0; i < reservations.length; i++) {
									reservationsStore.add(reservations[i]);
								}
								successCallback(reservations);
							},
							"readwrite"
						);
					});
				}
			}
		};
	});
	if (!db) {
		$.getJSON("/reservations.json", successCallback);
	}
};
