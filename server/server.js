const express = require('express')
const app = express()
const port = 3000
const multer = require('multer')
const cors = require("cors");
const fs = require('fs'); 
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const f = require('./hash')
var site = "Resource URL"  // 

const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./database/nft.db');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      if(file.mimetype === "application/pdf"){
        cb(null, "./doc"); 
      }else{
        cb(null, "./images"); 
      }
    },
    filename: (req, file, cb) => {
      db.all("select count(token_id) as sumCount from nftAssets",function(err,row){
        if (err) return next(err);
        var sumCount = row[0].sumCount
        if(file.mimetype === "application/pdf"){
          cb(null, Number(sumCount)+1+'.xyz');
        }else{
          cb(null, Number(sumCount)+1+'.png');
        }
      })
    },
});
const upload = multer({ storage: fileStorageEngine });

app.get('/', (req, res, next) => {
    res.send("no data")
})

app.get('/assets', (req, res, next) => {
     db.all("select * from nftAssets",function(err,row){
        if (err) return next(err);
         res.json({code:200, message: 'Successfully completed',data:row})
    })
})

app.get('/assets/:id', (req, res, next) => {
      db.get('SELECT * FROM nftAssets WHERE token_id = ?', req.params.id, function(err,row){
        if (err) return next(err);
         res.json({code:200, message: 'Successfully completed',data:row})
    });
})

app.delete('/assets/:id', (req, res, next) => {
    if (err) return next(err);
    db.run('DELETE FROM nftAssets WHERE token_id=?', req.params.id, function(err,row){
        if (err) return next(err);
        res.json({code:200, message: 'Successfully completed',data:row})
    });
})

app.post("/assets", upload.fields([
    { name: 'image'},
    { name: 'doc_path'} 
  ]), (req, res) => {
    if(req.body.name && req.body.description && req.files.image && req.files.doc_path){
      db.all("select count(token_id) as sumCount from nftAssets",function(err,row){
        if (err) return next(err);
        var sumCount = row[0].sumCount
        var tokenId = Number(sumCount)+1
        let hashVal = f.hashFileSha256Async(`./doc/${tokenId}.xyz`,f.algorithmType.SHA256)
        var metadata = {
          "name": req.body.name,
          "description": req.body.description, 
          "external_url": "",
          "image": site+"/images/"+tokenId+".png",
          "tokenId" : tokenId,
          "attributes": [
              {
                "trait_type": "hash", 
                "value": hashVal
              }
          ]
        }
        var metadataJson = JSON.stringify(metadata); 
        var tokenIdHex = Web3.utils.toHex(tokenId).replace('0x', '')
        var initNumber = "0000000000000000000000000000000000000000000000000000000000000000"
        var initNumberLength = initNumber.length
        var tokenIdHexLength = tokenIdHex.length
        var startCoordinate = initNumberLength-tokenIdHexLength
        var startIndex = startCoordinate
        var endIndex = 64
        if (endIndex < startIndex) {
          startIndex = endIndex;
        }
        var a = initNumber.substring(0, startIndex);
        var b = initNumber.substring(endIndex);
        var hexTokenId =a + b + tokenIdHex;
        fs.writeFile("./metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
          if (err) { 
              console.log("An error occured while writing JSON Object to File."); 
              return console.log(err); 
          }
          console.log("JSON file has been saved."); 
        });
            // const sql = `
            //   INSERT INTO 
            //   nftAssets(name,description,image,doc_path,metadata_path,date) 
            //   VALUES(?,?,?,?,?,?) 
            //   ;select last_insert_rowid();`;
            // if(req.body.name && req.body.description && req.body.image && req.body.doc_path && req.body.metadata_path){
            //     db.run(sql, req.body.name, req.body.description,req.body.image,req.body.doc_path,req.body.metadata_path, Math.floor(Date.now() / 1000), function(err,row){
            //         if (err) return next(err);
            //         res.json({code:200, message: 'Successfully completed',data:row})
            //     });
            // }else{
            //     res.json({code:201, message: 'Incomplete parameters',data:[]})
            // }
        })

        res.send({
          body: req.body,
          files: req.files
        })

        
    }else{
        res.send({
          body: '',
          files: req.files
       })
    }
})

// app.post('/assets', (req, res, next) => {
//     console.log(req.fields)
//     console.log(req.files)
//     return
//     const sql = `
//     INSERT INTO 
//     nftAssets(name,description,image,doc_path,metadata_path,date) 
//     VALUES(?,?,?,?,?,?) 
//     ;select last_insert_rowid();`;
//     if(req.body.name && req.body.description && req.body.image && req.body.doc_path && req.body.metadata_path){
//         db.run(sql, req.body.name, req.body.description,req.body.image,req.body.doc_path,req.body.metadata_path, Math.floor(Date.now() / 1000), function(err,row){
//             if (err) return next(err);
//             res.json({code:200, message: 'Successfully completed',data:row})
//         });
//     }else{
//         res.json({code:201, message: 'Incomplete parameters',data:[]})
//     }
// })

// {
//     "name":"name 1",
//     "description":"description a 1",
//     "image":"image 1",
//     "doc_path":"docPath 1",
//     "metadata_path":"metadataPath 1"
// }
app.put('/assets/:id', (req, res, next) => {
    console.log(1)
    if(req.body.name && req.body.description && req.body.image && req.body.doc_path && req.body.metadata_path){
        const sql = `
        UPDATE nftAssets
        SET name=?,description=?,image=?,doc_path=?,metadata_path=?
        WHERE token_id=?
        `
        db.run(sql, req.body.name, req.body.description,req.body.image,req.body.doc_path,req.body.metadata_path, req.params.id, function(err,row){
            if (err) return next(err);
            res.json({code:200, message: 'Successfully completed',data:row})
        });
    }
})

app.listen(port, function () {
  console.log('Express server running at http://127.0.0.1:3000')
})

