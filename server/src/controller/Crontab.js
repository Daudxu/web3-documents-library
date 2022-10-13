const crontabModel = require('../model/Crontab')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const Token = require('../utils/token')
const site = require('../../config/info').site;

module.exports = {
  getCrontab: async (req, res, next) => {
    let sql = crontabModel.getAllCrontab(req.body)
      queryAllSQL(sql, (err, data) => {
        if (err) return next(err);
        res.json(dataFormat(data, 200))
     })
  },
  getCrontabById: async (req, res, next) => {
    if(req.params.id){
      let sql = crontabModel.getCrontabById(req.params.id)
      queryGetSQL(sql, async (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  addCrontab: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.name && req.body.description && req.body.command && req.body.comment && req.body.execution_cycle){
            var dateTime = Math.floor(Date.now() / 1000)
            var parmas = {
                create_time: dateTime,
                update_time: dateTime,
            }
            var formData = Object.assign(req.body, parmas);
            let sql = crontabModel.addCrontab(formData)
            queryRunSQL(sql, async (err, data) => { 
                if (err) return next(err);
                res.json(dataFormat(data, 200))
            })
        }else{
          res.json(dataFormat([], 201))
        }
    }else{
      res.json(dataFormat([], 203))
    }
  },
  updateCrontab: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
            var dateTime = Math.floor(Date.now() / 1000)
            if( req.params.id && req.body.name && req.body.description && req.body.command && req.body.comment && req.body.execution_cycle){
              var parmas = {
                update_time: dateTime,
              }
              var formData = Object.assign(req.body, parmas);
              let sql = crontabModel.updateCrontab(formData, req.params.id)
              queryRunSQL(sql, async (err, data) => { 
                if (err) return next(err);
                res.json(dataFormat(data, 200))
              })
            }else{
              res.json(dataFormat([], 201))
            }
    }else{
      res.json(dataFormat([], 203))
    }
  },
  deleteCrontab: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        let sql = crontabModel.deleteCrontabById(req.params.id)
        queryRunSQL(sql, (err, data) => { 
            if (err) return next(err);
            res.json(dataFormat(data, 200))
        })
    }else{
      res.json(dataFormat([], 203))
    }
  }
}