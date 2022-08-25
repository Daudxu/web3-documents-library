const express = require('express')
const app = express()
const port = 3000
const multer = require('multer')
const cors = require("cors");
const fs = require('fs'); 
const Web3 = require('web3')
const MD5 = require('md5')
const path = require('path')
// const Tx = require('ethereumjs-tx').Transaction
const f = require('./utils/hash')
const Token = require('./utils/token')
var site = "https://library.web3devtest.xyz"  
// var os = require("os");
const sqlite3 = require('sqlite3');


var db = new sqlite3.Database('./database/nft.db');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(express.static('public'))

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      if(file.mimetype === "application/pdf"){
        cb(null, "./public/doc"); 
      }else{
        cb(null, "./public/images"); 
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

app.post('/login', (req, res, next) => {
       console.log()
      if(req.body.name && req.body.password){
        db.get('SELECT id FROM admin WHERE name = ? and password = ?', req.body.name, MD5(req.body.password), function(err,row){
             if (err) return next(err);
             if(row) {
                res.json({code:200, message: 'Successfully completed',data:{
                  token:Token.encrypt({id:row.id},'1d')
                }})
             }else{
                res.json({code:404, message: 'There is no user data',data:[]})
             }
        });
      }else{
        res.json({code:201, message: 'Incomplete parameters',data:[]})
      }
})

app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/assets', (req, res, next) => {
    db.all("select token_id, name, description, image, metadata_path, date from nftAssets order by token_id desc ",function(err,row){
        if (err) return next(err);
         res.json({code:200, message: 'Successfully completed',data:row})
    })
})

app.get('/assets/:id', (req, res, next) => {
    if (req.params.id) {
        db.get('SELECT token_id, name, description, image, metadata_path, date FROM nftAssets WHERE token_id = ?', req.params.id, function(err,row){
          if (err) return next(err);
          res.json({code:200, message: 'Successfully completed',data:row})
        });
    }else{
      res.json({code:203, message: 'Login information has expired',data:[]})
    }
})

app.delete('/assets/:id', (req, res, next) => {
    let tokenData = Token.decrypt(req.get('authorization')); 
    if (tokenData.token) {
        db.run('DELETE token_id, name, description, image, metadata_path, date FROM nftAssets WHERE token_id=?', req.params.id, function(err,row){
            if (err) return next(err);
            res.json({code:200, message: 'Successfully completed',data:row})
        });
    }else{
      res.json({code:203, message: 'Login information has expired',data:[]})
    }
})

app.post("/assets", upload.fields([
  { name: 'image'},
  { name: 'doc_path'} 
]), (req, res, next) => {
      let tokenData = Token.decrypt(req.get('authorization')); 
      if (tokenData.token) {
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
                  fs.writeFile("./public/metadata/"+hexTokenId+".json", metadataJson, 'utf8', function (err) { 
                    if (err) { 
                        console.log("An error occured while writing JSON Object to File."); 
                        return console.log(err); 
                    }
                  });
                  const sql = `
                  INSERT INTO 
                  nftAssets(name,description,image,doc_path,metadata_path,date) 
                  VALUES(?,?,?,?,?,?)`;
                  db.run(sql, req.body.name, req.body.description,site+"/images/"+tokenId+".png",site+"/doc/"+tokenId+".xyz",site+"/metadata/"+hexTokenId+".json", Math.floor(Date.now() / 1000), function(err,row){
                    if (err) return next(err);
                    res.json({code:200, message: 'Successfully completed',data:row})
                  });
            })        
          }else{
              res.send({
                body: '',
                files: req.files
            })
          }
      }else{
         res.json({code:203, message: 'Login information has expired',data:[]})
      }
})

app.put('/assets/:id', (req, res, next) => {
  let tokenData = Token.decrypt(req.get('authorization')); 
  if (tokenData.token) {
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
  }else{
    res.json({code:203, message: 'Login information has expired',data:[]})
  }
})


app.get('/prespectives', (req, res, next) => {
  db.all("select * from prespectives order by id desc",function(err,row){
      if (err) return next(err);
       res.json({code:200, message: 'Successfully completed',data:row})
  })
})


const fileStorageEng = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, "./public/img"); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now()+'.png');
  },
});

const uploadImage = multer({ storage: fileStorageEng });

app.post("/prespectives", uploadImage.fields([
  { name: 'image'}
]), (req, res, next) => {
      let tokenData = Token.decrypt(req.get('authorization')); 
      if (tokenData.token) {
          if(req.body.title && req.body.description && req.files.image.length > 0 && req.body.url){
            console.log(req.files.image[0].destination+'/'+req.files.image[0].filename)
            const sql = `
                  INSERT INTO 
                  prespectives(title,description,image,url,date) 
                  VALUES(?,?,?,?,?)`;
                  db.run(sql, req.body.title, req.body.description,site+'/img/'+req.files.image[0].filename,req.body.url, Math.floor(Date.now() / 1000), function(err,row){
                    if (err) return next(err);
                    res.json({code:200, message: 'Successfully completed',data:row})
                  });
          }else{
            res.json({code:201, message: 'Incomplete parameters',data:[]})
          }
      }else{
         res.json({code:203, message: 'Login information has expired',data:[]})
        
      }
})


// app.delete('/assets/:id', (req, res, next) => {
//   let tokenData = Token.decrypt(req.get('authorization')); 
//   if (tokenData.token) {
//       db.run('DELETE token_id, name, description, image, metadata_path, date FROM nftAssets WHERE token_id=?', req.params.id, function(err,row){
//           if (err) return next(err);
//           res.json({code:200, message: 'Successfully completed',data:row})
//       });
//   }else{
//     res.json({code:203, message: 'Login information has expired',data:[]})
//   }
// })

// app.put('/assets/:id', (req, res, next) => {
//   let tokenData = Token.decrypt(req.get('authorization')); 
//   if (tokenData.token) {
//       if(req.body.name && req.body.description && req.body.image && req.body.doc_path && req.body.metadata_path){
//           const sql = `
//           UPDATE nftAssets
//           SET name=?,description=?,image=?,doc_path=?,metadata_path=?
//           WHERE token_id=?
//           `
//           db.run(sql, req.body.name, req.body.description,req.body.image,req.body.doc_path,req.body.metadata_path, req.params.id, function(err,row){
//               if (err) return next(err);
//               res.json({code:200, message: 'Successfully completed',data:row})
//           });
//       }
//   }else{
//     res.json({code:203, message: 'Login information has expired',data:[]})
//   }
// })



app.listen(port, function () {
  console.log('Express server running at http://127.0.0.1:3000')
})

