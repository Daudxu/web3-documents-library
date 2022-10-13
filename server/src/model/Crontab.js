module.exports = {
    getAllCrontab: () => {
      return `select * from crontab order by id desc`
    },
    getCrontabById: (id) => {
      return `SELECT * FROM crontab WHERE id = ${id}`
    },
    getCrontabCount: () => {
      return `select count(id) as sumCount from crontab`
    },
    addCrontab: (parmas) => {
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
          return `INSERT INTO crontab (  ${filter} ) VALUES ( ${val} ) `
      } catch (e) {
        console.log(e)
      }
    },
    updateCrontab: (parmas, id) => {
        let filter = ''
        var keys = Object.keys(parmas)
        var values = Object.values(parmas)
        keys.forEach( (e, i) => {
          let point = (i+1) !== keys.length ? ',' : ''
          filter += `'${e}'='${values[i]}'${point}`
        })
        return `UPDATE crontab
                SET ${filter} 
                WHERE id=${id} ;`
    },
    deleteCrontabById: (id) => {
      return `DELETE FROM crontab where id='${id}' `
    }
  }
  
  
  