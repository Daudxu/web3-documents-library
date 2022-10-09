const courseModel = require('../model/Course')
const videoModel = require('../model/Video')
const { queryAllSQL, queryGetSQL, queryRunSQL, dataFormat } = require('../../config/connection');
const Token = require('../utils/token')
const fs = require('fs'); 
const path = require('path');
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const Web3 = require('web3'); 
const MetadataHex = require('../utils/metadataHex')
const site = require('../../config/info').site;
const COURSE_TOKEN_ABI =  [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newValue","type":"uint256"}],"name":"ValueChanged","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cashierAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_courseId","type":"uint256"}],"name":"getCoursePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_courseId","type":"uint256"}],"name":"getCoursePriceHistory","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_cashierAddress","type":"address"},{"internalType":"string","name":"_uri","type":"string"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mintBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"setCashierAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_courseId","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setCoursePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newuri","type":"string"}],"name":"setURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
const COURSE_TOKEN_ADDRESS = "0x4bA94C6b71b84c3994bC02d03454E74Bfc993CF6"
module.exports = {
  getCourse: async (req, res, next) => {
    let sql = courseModel.getAllCourse(req.body)
      queryAllSQL(sql, (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
     })
  },
  getCourseById: async (req, res, next) => {
    if(req.params.id){
      let CourseSql = courseModel.getCourseById(req.params.id)
      queryGetSQL(CourseSql, async (err, data) => { 
        if (err) return next(err);
        res.json(dataFormat(data, 200))
      })
    }else{
      res.json(dataFormat([], 201))
    }
  },
  addCourse: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        if(req.body.title && req.body.description && req.files.cover){
          let courseCountSql = courseModel.getCourseCount()
          queryGetSQL(courseCountSql, async (err, data) => { 
            if (err) return next(err);
            var sumCount = data.sumCount
            var courseId = Number(sumCount)+1
            var metadata = {
              "name": req.body.name,
              "description": req.body.description, 
              "external_url": "",
              "image": site+"/course/images/"+courseId+".png",
              "tokenId" : courseId,
              "attributes": [
                  {
                    "trait_type": " Course type", 
                    "value": "Video Course"
                  }
              ]
            }
            var metadataJson = JSON.stringify(metadata); 
            var hexTokenId = MetadataHex.getMetadataHex(courseId);
            fs.writeFile("./public/course/metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
              if (err) { 
                  console.log("An error occured while writing JSON Object to File."); 
                  return console.log(err); 
              }
            });
            var dateTime = Math.floor(Date.now() / 1000)
            var parmas = {
              title: req.body.title,
              description: req.body.description,
              content: req.body.content,
              cover: site+"/course/images/"+courseId+".png",
              metadata: site+"/course/metadata/"+hexTokenId+".json",
              create_date: dateTime,
              update_date: dateTime,
            }
            let CourseSql = courseModel.addCourse(parmas)
            queryRunSQL(CourseSql, async (err, data) => { 
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
  updateCourse: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        var parmas = ""
        var dateTime = Math.floor(Date.now() / 1000)
        var courseId = Number(req.params.id)
        var metadata = {
          "name": req.body.name,
          "description": req.body.description, 
          "external_url": "",
          "image": site+"/course/images/"+courseId+".png",
          "tokenId" : courseId,
          "attributes": [
              {
                "trait_type": " Course type", 
                "value": "Video Course"
              }
          ]
        }
        var metadataJson = JSON.stringify(metadata); 
        var hexTokenId = MetadataHex.getMetadataHex(courseId);
        if( req.params.id && req.body.title && req.body.description && req.files.cover){
            parmas = {
              title: req.body.title,
              description: req.body.description,
              content: req.body.content,
              cover: site+"/course/images/"+courseId+".png",
              metadata: site+"/course/metadata/"+hexTokenId+".json",
              update_date: dateTime,
            }
            let CourseSql = courseModel.updateCourse(parmas, req.params.id)
            queryRunSQL(CourseSql, async (err, data) => { 
                if (err) return next(err);
                fs.writeFile("./public/course/metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
                  if (err) { 
                      console.log("An error occured while writing JSON Object to File."); 
                      return console.log(err); 
                  }
                });
                res.json(dataFormat(data, 200))
            })
        }else if(req.params.id && req.body.title && req.body.description){
          parmas = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            metadata: site+"/course/metadata/"+hexTokenId+".json",
            update_date: dateTime,
          }
          let CourseSql = courseModel.updateCourse(parmas, req.params.id)
          queryRunSQL(CourseSql, async (err, data) => { 
              if (err) return next(err);
              fs.writeFile("./public/course/metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
                if (err) { 
                    console.log("An error occured while writing JSON Object to File."); 
                    return console.log(err); 
                }
              });
              res.json(dataFormat(data, 200))
          })
        }else{
          res.json(dataFormat([], 201))
        }
    }else{
      res.json(dataFormat([], 203))
    }
  },
  courseVideoList: async (req, res, next) => {
    if(req.params.id){
      let sql = videoModel.getCourseVideoLListById(req.params.id)
      queryAllSQL(sql, (err, data) => { 
        if (err) return next(err);
        
        res.json(dataFormat(data, 200))
     })
    }else{
      res.json(dataFormat([], 404))
    }
  },
  getCourseVideoById: async (req, res, next) => {
    var sourcePath = path.join(__dirname,'../../')+"public/course/video/source/";
    if(req.params.id){
      const range = req.headers.range;
      if (!range) {
          res.status(400).send("Requires Range header");
      }else{
        let VideoSql = videoModel.getCourseVideoById(req.params.id)
        queryGetSQL(VideoSql, async (err, data) => {
          if (err) return next(err);
          if(typeof(data) !== "undefined"){
            var web3 = new Web3(new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com"));
        //     // const web3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/i5hWlqeR3zjYbXDNOOmNva7vh5oxk_v7");
            var signatrueAccount = await web3.eth.accounts.recover("knowledge.serenity-research.com", req.params.signatrue)
            var myContract = new web3.eth.Contract(COURSE_TOKEN_ABI, COURSE_TOKEN_ADDRESS)
            var isOwner = await myContract.methods.balanceOf(signatrueAccount, data.course_id).call({from:signatrueAccount})
            if(parseInt(isOwner) > 0) {
              const videoPath = sourcePath+req.params.id+".mp4";
              const videoSize = fs.statSync(videoPath).size;
              const CHUNK_SIZE = 10 ** 6;
              const start = Number(range.replace(/\D/g, ""));
              const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
              const contentLength = end - start + 1;
              const headers = {
                  "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                  "Accept-Ranges": "bytes",
                  "Content-Length": contentLength,
                  "Content-Type": "video/mp4",
              };
              res.writeHead(206, headers);
              const videoStream = fs.createReadStream(videoPath, { start, end });
              videoStream.pipe(res);
            }else{
              res.json(dataFormat(data, 404))
            }
        
    //         // res.json(dataFormat(data, 200))
          }else{
            res.json(dataFormat(data, 404))
          }
        })
     
      }
     
    }else{
      res.json(dataFormat([], 404))
    }
  },
  setCoursePriceById: async (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
      var dateTime = Math.floor(Date.now() / 1000)
      if(req.params.id){
        parmas = {
          price: req.body.price,
          update_date: dateTime,
        }
        let CourseSql = courseModel.updateCourse(parmas, req.params.id)
        queryRunSQL(CourseSql, async (err, data) => { 
            if (err) return next(err);
            res.json(dataFormat(data, 200))
        })
       
      }else{
        res.json(dataFormat([], 404))
      }
    }else{
      res.json(dataFormat([], 203))
    }
   
  }
}