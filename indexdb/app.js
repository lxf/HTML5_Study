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

function getDataByKey(db,storeName,value) {
	var transaction=db.transaction(storeName,'readwrite');
	var store=transaction.objectStore(storeName);
	var request=store.get(value);
	request.onsuccess=function (e) {
		var student=e.target.result;
		console.log(student.name);	
	};	
};

function updateDataByKey(db,storename,value) {
	var transaction=db.transaction(storename,'readwrite');
	var store=transaction.objectStore(storename);
	var request=store.get(value);
	request.onsuccess=function (e) {
		var student=e.target.result;
		student.age=33;
store.put(student);
	};
};

function  deleteDataByKey(db,storename,value) {
	var transaction=db.transaction(storename,'readwrite');
	var store=transaction.objectStore(storename);
	store.delete(value);
};

function clearObjectStore(db,storename) {
		var transaction=db.transaction(storename,'readwrite');
	var store=transaction.objectStore(storename);
	store.clear();
};

function deleteObjectStore(db,storename) {
	var transaction=db.transaction(storename,'versionchange');
db.deleteObjectStore(storename);
};

function fetchStoreByCursor(db,storename) {
	var transaction=db.transaction(storename);
	var store=transaction.objectStore(storename);
	var request=store.openCursor();
	request.onsuccess=function (e) {
		var cursor=e.target.result;
		if(cursor)
		{
			console.log(cursor.key);
			var currentStudent=cursor.value;
			console.log(currentStudent.name);
			cursor.continue();
		}
	};
};

function getDataByIndex(db,storename) {
	var transaction=db.transaction(storename);
	var store=transaction.objectStore(storename);
	var index=store.index('ageindex');
	index.get(22).onsuccess=function (e) {
	    var student=e.target.result;
		console.log(student.id);	
	};
};

function getMultiData(db,storename) {
	var transaction=db.transaction(storename);
	var store=transaction.objectStore(storename);
	var index=store.index('nameindex');
	var request=index.openCursor(null,IDBCursor.prev);
	request.onsuccess=function (e) {
	   var cursor=e.target.result;
	   if(cursor)
	   {
		   var student=e.target.result;
		   console.log(student.name);
		   cursor.continue();
	   }	
	};
};
openDB(DBEntity.name, DBEntity.version);
setTimeout(function () {
	addData(DBEntity.db, 'students');
}, 1000);