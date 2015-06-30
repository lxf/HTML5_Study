var DBEntity = {
	name: 'testdb',
	version: 2,
	db: null
},
	students = [
		{
			id: 1001,
			name: "Byron",
			age: 24
		},
		{
            id: 1002,
            name: "Frank",
            age: 30
        },
		{
            id: 1003,
            name: "Aaron",
            age: 26
        }
	];
	
openDB(DBEntity.name, DBEntity.version);
setTimeout(function () {
	addData(DBEntity.db, 'students');
}, 1000);


function openDB(name, version) {
	var nowversion = version || 1;
	var request = window.indexedDB.open(name, nowversion);

	request.onerror = function (event) {
		console.log('db operation failed');
		console.log('error code' + event.target.errorCode);
	};

	request.onsuccess = function (event) {
		console.log('onsuccess');
		DBEntity.db = event.target.result;
	};

//只有在改变db版本的时候才触发
	request.onupgradeneeded = function (event) {
		var db = request.result;
		if (!db.objectStoreNames.contains('students')) {
			var store=db.createObjectStore('students', { keyPath: 'id' });
		    var ageindex=store.createIndex('ageindex','age');
		    var nameindex=store.createIndex('nameindex','name');
		}
		console.log('db version changed to ' + version);
	};
}
//关闭数据库
function closeDB(db) {
	db.close();
}
//删除数据库
function deleteDB(dbname) {
	indexedDB.deleteDatabase(dbname);
};

function addData(db, storename) {
	var transaction = db.transaction(storename, 'readwrite');
	var store = transaction.objectStore(storename);
	for (var i = 0; i < students.length; i++) {
		store.add(students[i]);
	}
};

function getDataByKey(db, storeName, value) {
	var transaction = db.transaction(storeName, 'readwrite');
	var store = transaction.objectStore(storeName);
	var request = store.get(value);
	request.onsuccess = function (e) {
		var student = e.target.result;
		console.log(student.name);
	};
};

function updateDataByKey(db, storename, value) {
	var transaction = db.transaction(storename, 'readwrite');
	var store = transaction.objectStore(storename);
	var request = store.get(value);
	request.onsuccess = function (e) {
		var student = e.target.result;
		student.age = 33;
		store.put(student);
	};
};

function deleteDataByKey(db, storename, value) {
	var transaction = db.transaction(storename, 'readwrite');
	var store = transaction.objectStore(storename);
	store.delete(value);
};

function clearObjectStore(db, storename) {
	var transaction = db.transaction(storename, 'readwrite');
	var store = transaction.objectStore(storename);
	store.clear();
};

function deleteObjectStore(db, storename) {
	var transaction = db.transaction(storename, 'versionchange');
	db.deleteObjectStore(storename);
};

function fetchStoreByCursor(db, storename) {
	var transaction = db.transaction(storename, 'readwrite');
	var store = transaction.objectStore(storename);
	var request = store.openCursor();
	request.onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			console.log(cursor.key);
			var currentStudent = cursor.value;
			console.log(currentStudent.name);
			console.log(currentStudent.age);
			cursor.continue();
		}
	};
};

function getDataByIndex(db, storename,searchindex) {
	var transaction = db.transaction(storename);
	var store = transaction.objectStore(storename);
	var index = store.index('ageindex');
	var request =index.get(parseInt(searchindex));
	request.onsuccess = function () {
		var student = request.result;
		console.log(student.id);
	};
};

function getMultiData(db, storename) {
	var transaction = db.transaction(storename);
	var store = transaction.objectStore(storename);
	var index = store.index('nameindex');
	var request = index.openCursor(null, IDBCursor.prev);
	request.onsuccess = function (e) {
		var cursor = e.target.result;
		if (cursor) {
			var student = e.target.result.value;
			console.log(student.name);
			cursor.continue();
		}
	};
};
