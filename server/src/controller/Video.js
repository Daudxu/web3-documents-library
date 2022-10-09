const videoModel = require('../model/Video')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const Token = require('../utils/token')
const fs = require('fs'); 
const MetadataHex = require('../utils/metadataHex');
const site = require('../../config/info').site;

module.exports = {
  getAllCourseVideo: async (req, res, next) => {
    let sql = videoModel.getAllCourseVideo()
      queryAllSQL(sql, (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
     })
  },
  getCourseVideoById: async (req, res, next) => {
    if(req.params.id){
      let VideoSql = videoModel.getCourseVideoById(req.params.id)
      queryGetSQL(VideoSql, async (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  addCourseVideo: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.title && req.body.description && req.body.course_id && req.files.cover && req.files.video){
          let VideoCountSql = videoModel.getCourseVideoCount()
   
          queryGetSQL(VideoCountSql, async (err, data) => { 
            if (err) return next(err);
            var sumCount = data.sumCount
            var VideoId = Number(sumCount)+1
            var dateTime = Math.floor(Date.now() / 1000)
            let CountCourseVideoSql = videoModel.getCountCourseVideo(req.body.course_id)
            queryGetSQL(CountCourseVideoSql, async (err, countdata) => { 
              if (err) return next(err);
              var sumCourseCount = countdata.sumCount
              var courseVideoId = Number(sumCourseCount)+1
              var parmas = {
                cover: site+"/course/video/image/"+VideoId+'.'+req.files.cover[0].mimetype.split("/")[1],
                source: "./course/video/source/"+VideoId+'.'+req.files.video[0].mimetype.split("/")[1],
                course_video_id: courseVideoId,
                create_date: dateTime,
                update_date: dateTime,
              }
              var formData = Object.assign(req.body, parmas)
              let courseVideoSql = videoModel.addCourseVideo(formData)
              queryRunSQL(courseVideoSql, async (err, data) => { 
                  if (err) return next(err);
                  res.json(dataFormat(data, 200))
              })
            })
       
          })
 
        }else{
          res.json(dataFormat([], 201))
        }
    }else{
      res.json(dataFormat([], 203))
    }
  },
  updateCourseVideo: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        var parmas = ""
        var dateTime = Math.floor(Date.now() / 1000)
        var VideoId = Number(req.params.id)
        if(req.params.id && req.body.title && req.body.description && req.body.course_id && req.files.cover && req.files.video){
          var parmas = {
            title: req.body.title,
            description: req.body.description,
            course_id: req.body.course_id,
            cover: site+"/course/video/image/"+VideoId+'.'+req.files.cover[0].mimetype.split("/")[1],
            source: "./course/video/source/"+VideoId+'.'+req.files.video[0].mimetype.split("/")[1],
            course_video_id: req.body.course_video_id,
            update_date: dateTime,
          }
          let courseVideoSql = videoModel.updateCourseVideo(parmas, req.params.id)
          queryRunSQL(courseVideoSql, async (err, data) => { 
              if (err) return next(err);
              res.json(dataFormat(data, 200))
          })
        }else if(req.params.id && req.body.title && req.body.description && req.body.course_id && req.files.cover){
          var parmas = {
            title: req.body.title,
            description: req.body.description,
            course_id: req.body.course_id,
            cover: site+"/course/video/image/"+VideoId+'.'+req.files.cover[0].mimetype.split("/")[1],
            course_video_id: req.body.course_video_id,
            update_date: dateTime,
          }
          let courseVideoSql = videoModel.updateCourseVideo(parmas, req.params.id)
          queryRunSQL(courseVideoSql, async (err, data) => {
              if (err) return next(err);
              res.json(dataFormat(data, 200))
          })
        }else if(req.params.id && req.body.title && req.body.description && req.body.course_id && req.files.video){
          var parmas = {
            title: req.body.title,
            description: req.body.description,
            course_id: req.body.course_id,
            source: "./course/video/source/"+VideoId+'.'+req.files.video[0].mimetype.split("/")[1],
            course_video_id: req.body.course_video_id,
            update_date: dateTime,
          }
          let courseVideoSql = videoModel.updateCourseVideo(parmas, req.params.id)
          queryRunSQL(courseVideoSql, async (err, data) => { 
              if (err) return next(err);
              res.json(dataFormat(data, 200))
          })
        }else if(req.params.id && req.body.title && req.body.description && req.body.course_id ){
          var parmas = {
            title: req.body.title,
            description: req.body.description,
            course_id: req.body.course_id,
            course_video_id: req.body.course_video_id,
            update_date: dateTime,
          }
          let courseVideoSql = videoModel.updateCourseVideo(parmas, req.params.id)
          queryRunSQL(courseVideoSql, async (err, data) => {
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
  delCourseVideoById: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        let sql = videoModel.delCourseVideoById(req.params.id)
        queryRunSQL(sql, (err, data) => { 
            if (err) return next(err);
            res.json(dataFormat(data, 200))
        })
    }else{
      res.json(dataFormat([], 203))
    }
  }
}