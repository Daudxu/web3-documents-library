const SpiderModel = require('../model/Spider')
const path = require('path')
const fs = require('fs')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const Token = require('../utils/token')
const site = require('../../config/info').site;

module.exports = {
  getSpider: async (req, res, next) => {
    let sql = SpiderModel.getAllSpider(req.body)
      queryAllSQL(sql, (err, data) => {
        if (err) return next(err);
        res.json(dataFormat(data, 200))
     })
  },
  getSpiderById: async (req, res, next) => {
    if(req.params.id){
      let sql = SpiderModel.getSpiderById(req.params.id)
      queryGetSQL(sql, async (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  addSpider: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.name && req.body.description && typeof(req.files.script_path) !== "undefined"){
            const dateTime = Math.floor(Date.now() / 1000)
            const projectPath = path.resolve(__dirname, "../../Spider/"+req.body.name+"/"+req.files.script_path[0].originalname);
            var parmas = {
                script_path: projectPath,
                create_time: dateTime,
                update_time: dateTime,
            }
            var formData = Object.assign(req.body, parmas);
            let sql = SpiderModel.addSpider(formData)
            queryRunSQL(sql, async (err, data) => { 
                if (err) return next(err);
                fs.writeFile(path.resolve(__dirname, "../../Spider/"+req.body.name)+"/run.sh",'cd '+path.resolve(__dirname, "../../Spider/"+req.body.name)+'\n pyhon '+ req.files.script_path[0].originalname + '\n date +"%Y-%m-%d %H:%M:%S', function(err){
                  if (err) return next(err);
                  res.json(dataFormat(data, 200))
                })
            })
        }else{
          res.json(dataFormat([], 201))
        }
    }else{
      res.json(dataFormat([], 203))
    }
  },
  updateSpider: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
            if( req.params.id && req.body.name && req.body.description && typeof(req.files.script_path) !== "undefined"){
                const dateTime = Math.floor(Date.now() / 1000)
                const projectPath = path.resolve(__dirname, "../../Spider/"+req.body.name+"/"+req.files.script_path[0].originalname);
                var parmas = {
                    script_path: projectPath,
                    update_time: dateTime,
                }
                var formData = Object.assign(req.body, parmas);
                let sql = SpiderModel.updateSpider(formData, req.params.id)
                queryRunSQL(sql, async (err, data) => { 
                    if (err) return next(err);
                    res.json(dataFormat(data, 200))
                })
            }else if(req.params.id && req.body.name && req.body.description) {
                const dateTime = Math.floor(Date.now() / 1000)
                var parmas = {
                    update_time: dateTime,
                }
                var formData = Object.assign(req.body, parmas);
                let sql = SpiderModel.updateSpider(formData, req.params.id)
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
  deleteSpider: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        let sql = SpiderModel.deleteSpiderById(req.params.id)
        queryRunSQL(sql, (err, data) => { 
            if (err) return next(err);
            res.json(dataFormat(data, 200))
        })
    }else{
      res.json(dataFormat([], 203))
    }
  }
}

