var DBEntity = {
	name: 'testdb',
	version: 1,
	db: 'students'
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

function openDB(name, version) {
	var version = version || 1,
		request = window.indexedDB.open(name, version);
				request.onerror = function (event) {
		console.log('db operation failed');
		console.log('error code' + event.target.errorCode);
	};
	request.onsuccess = function (event) {
		DBEntity.db = event.target.result;
	};

	request.onupgradeneeded = function (event) {
		var db = event.target.result;
		console.log(db.objectStoreNames);
		if (!db.objectStoreNames.contains('students')) {
			db.createObjectStore('students', { keyPath: 'id' });
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


openDB(DBEntity.name, DBEntity.version);
setTimeout(function () {
	addData(DBEntity.db, 'students');
}, 1000);