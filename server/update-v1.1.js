var sqlite3 = require('sqlite3');
const fs = require('fs'); 
const checkInstall = fs.existsSync("update-v1.1.lock");
let db= new sqlite3.Database('./database/nft.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if(!checkInstall) {
        createTables(db)
    }else{
     console.log("你已经更新过了，请不要重新更新");
    }
});

function createTables(newdb) {
    newdb.exec(`
    CREATE TABLE "subgraph_api" (
        "id"	INTEGER NOT NULL UNIQUE,
        "apikey"	TEXT NOT NULL,
        "name"	TEXT NOT NULL,
        "description"	TEXT,
        "apiurl"	INTEGER NOT NULL,
        "apisql"	INTEGER NOT NULL,
        "create_date"	TEXT NOT NULL,
        "update_date"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    )
    CREATE TABLE "course" (
        "id"	INTEGER NOT NULL UNIQUE,
        "title"	TEXT NOT NULL,
        "description"	TEXT NOT NULL,
        "content"	TEXT,
        "price"	TEXT NOT NULL,
        "metadata"	TEXT NOT NULL,
        "create_date"	TEXT NOT NULL,
        "update_date"	TEXT,
        "cover"	TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
    )
    CREATE TABLE "video" (
        "id"	INTEGER NOT NULL UNIQUE,
        "title"	TEXT NOT NULL,
        "description"	TEXT NOT NULL,
        "content"	TEXT,
        "cover"	TEXT NOT NULL,
        "create_date"	TEXT NOT NULL,
        "update_date"	TEXT,
        "course_id"	INTEGER NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
    )
    alter table prespectives add sort INTEGER DEFAULT 0
    `, ()  => {
            fs.writeFile('update-v1.1.lock','update-v1.1.lock','utf8',function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log("安装成功");
            })
    });
}
