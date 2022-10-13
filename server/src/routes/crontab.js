const express = require('express')
const router = express.Router()
const crontabController = require('../controller/Crontab')
// const { jsonParser } = require('../utils/postSetting')
const multer = require('multer')
const crontabModel = require('../model/Crontab')
const { queryGetSQL} = require('../../config/connection')

const fileStorageEng = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, "./public/subgraph"); 
    },
    filename: (req, file, cb) => {
          if(req.params.id){
            cb(null, Number(req.params.id)+'.png');
          }else{
            let subgraphSql = crontabModel.getCrontabCount()
            queryGetSQL(subgraphSql, async (err, data) => { 
                if (err) return next(err);
                var sumCount =data.sumCount;
                cb(null, Number(sumCount)+1+'.png');
           })
          }
    },
});
const uploadImage = multer({ storage: fileStorageEng });

router.get('/', crontabController.getCrontab)
router.get('/:id', crontabController.getCrontabById)
router.post('/', uploadImage.fields([
    { name: 'image'}
  ]), crontabController.addCrontab)
router.put('/:id', uploadImage.fields([
    { name: 'image'}
  ]), crontabController.updateCrontab)
router.delete('/:id',crontabController.deleteCrontab)

module.exports = router

