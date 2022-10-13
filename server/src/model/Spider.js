module.exports = {
    getAllSpider: () => {
      return `select * from Spider order by id desc`
    },
    getSpiderById: (id) => {
      return `SELECT * FROM Spider WHERE id = ${id}`
    },
    getSpiderByApikey: (apikey) => {
      return `SELECT apiurl, apisql FROM Spider WHERE apikey = '${apikey}' `
    },
    getSpiderCount: () => {
      return `select count(id) as sumCount from Spider`
    },
    addSpider: (parmas) => {
      try {
          let filter = ''
          let val = ''
          var keys = Object.keys(parmas)
          var values = Object.values(parmas)
          keys.forEach( (e, i) => {
            let point = (i+1) !== keys.length ? ',' : ''
            filter += `'${e}' ${point}`
            val += `'${values[i]}' ${point}`
          })
          return `INSERT INTO Spider (  ${filter} ) VALUES ( ${val} ) `
      } catch (e) {
        console.log(e)
      }
    },
    updateSpider: (parmas, id) => {
        let filter = ''
        var keys = Object.keys(parmas)
        var values = Object.values(parmas)
        keys.forEach( (e, i) => {
          let point = (i+1) !== keys.length ? ',' : ''
          filter += `'${e}'='${values[i]}'${point}`
        })
        return `UPDATE Spider
                SET ${filter} 
                WHERE id=${id} ;`
    },
    deleteSpiderById: (id) => {
      return `DELETE FROM Spider where id='${id}' `
    }
  }
  
  
  // CREATE TABLE "crontab" (
  //   "id"	INTEGER NOT NULL UNIQUE,
  //   "name"	TEXT NOT NULL,
  //   "description"	TEXT,
  //   "command"	TEXT NOT NULL,
  //   "comment"	NUMERIC NOT NULL,
  //   "execution_cycle"	REAL NOT NULL,
  //   "create_time"	NUMERIC NOT NULL,
  //   "update_time"	TEXT,
  //   PRIMARY KEY("id" AUTOINCREMENT)
  // )


  // CREATE TABLE "spider" (
  //   "id"	INTEGER NOT NULL UNIQUE,
  //   "name"	TEXT NOT NULL,
  //   "description"	TEXT,
  //   "script_path"	TEXT NOT NULL,
  //   "create_time"	TEXT NOT NULL,
  //   "update_time"	TEXT,
  //   PRIMARY KEY("id" AUTOINCREMENT)
  // )