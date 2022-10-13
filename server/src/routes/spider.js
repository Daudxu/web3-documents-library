const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const spiderController = require('../controller/Spider')
// const { jsonParser } = require('../utils/postSetting')
const multer = require('multer')
const spiderModel = require('../model/Spider')

const checkDir = (path) => {
  return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
          if(err){
              resolve(false);
          }else{
              resolve(stats);
          }
      })
  })
}

const mkdir = (path) => {
  return new Promise((resolve, reject) => {
      fs.mkdir(path, err => {
          if(err){
              resolve(false);
          }else{
              resolve(true);
          }
      })
  })
}

const fileStorageEng = multer.diskStorage({
    destination: async (req, file, cb) => {
     const projectPath = path.resolve(__dirname, "../../Spider/"+req.body.name);
     var isExists =  await checkDir(projectPath)
     if(isExists) {
      cb(null, "./Spider/"+req.body.name); 
     }else{
        var isMkdir =  await mkdir(projectPath)
        if(isMkdir){
          cb(null, "./Spider/"+req.body.name); 
        }
     }
    },
    filename: (req, file, cb) => {
       cb(null, file.originalname)
    },
});
const uploadImage = multer({ storage: fileStorageEng });

router.get('/', spiderController.getSpider)
router.get('/:id', spiderController.getSpiderById)
router.post('/', uploadImage.fields([
    { name: 'script_path'}
  ]), spiderController.addSpider)
router.put('/:id', uploadImage.fields([
    { name: 'script_path'}
  ]), spiderController.updateSpider)
router.delete('/:id',spiderController.deleteSpider)

module.exports = router

