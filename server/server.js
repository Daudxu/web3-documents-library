const express = require('express')
const app = express()
const port = 3000
const multer = require('multer')
const cors = require("cors");
const fs = require('fs'); 
const Web3 = require('web3')
const MD5 = require('md5')
const path = require('path')
const f = require('./utils/hash')
const Token = require('./utils/token')
var site = "https://knowledge.serenity-research.com"  
const sqlite3 = require('sqlite3');
const ApolloBoost = require('apollo-boost');  
const fetch = require('node-fetch');   
const { createHttpLink } = require('apollo-link-http'); 
const {ApolloClient, InMemoryCache} = ApolloBoost 
const gql = require("graphql-tag");



var db = new sqlite3.Database('./database/nft.db');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
// app.use(express.static('public'))
app.use(express.static(__dirname + '/public'))

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
    db.all("select token_id, name, description, content, image, metadata_path, date from nftAssets order by token_id desc ",function(err,row){
        if (err) return next(err);
         res.json({code:200, message: 'Successfully completed',data:row})
    })
})

app.get('/assets/:id', (req, res, next) => {
    if (req.params.id) {
        db.get('SELECT token_id, name, description, content, image, metadata_path, date FROM nftAssets WHERE token_id = ?', req.params.id, function(err,row){
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
                  let hashVal = f.hashFileSha256Async(`../public/doc/${tokenId}.xyz`,f.algorithmType.SHA256)
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


app.get('/prespectives', (req, res, next) => {
  db.all("select * from prespectives order by sort desc,id desc",function(err,row){
      if (err) return next(err);
       res.json({code:200, message: 'Successfully completed',data:row})
  })
})


const fileStorageEng = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, "./public/img"); 
  },
  filename: (req, file, cb) => {
    db.all("select count(id) as sumCount from prespectives",function(err,row){
      if (err) return next(err);
      var sumCount = row[0].sumCount
      cb(null, Number(sumCount)+1+'.png');
    })
  },
});

const uploadImage = multer({ storage: fileStorageEng });

app.post("/prespectives", uploadImage.fields([
  { name: 'image'}
]), (req, res, next) => {
      let tokenData = Token.decrypt(req.get('authorization')); 
      if (tokenData.token) {
          if(req.body.title && req.body.description && req.files.image && req.body.url){
            console.log(req.files.image[0].destination+'/'+req.files.image[0].filename)
            const sql = `
                  INSERT INTO 
                  prespectives(title,description,image,url,date,sort) 
                  VALUES(?,?,?,?,?,?)`;
                  db.run(sql, req.body.title, req.body.description,site+'/img/'+req.files.image[0].filename,req.body.url, Math.floor(Date.now() / 1000, req.body.sort?req.body.sort:0), function(err,row){
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

const fileStorageEngineUpdate = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.mimetype === "application/pdf"){
      cb(null, "./public/doc"); 
    }else{
      cb(null, "./public/images"); 
    }
  },
  filename: (req, file, cb) => {
      if(file.mimetype === "application/pdf"){
        cb(null, Number(req.params.id)+'.xyz');
      }else{
        cb(null, Number(req.params.id)+'.png');
      }
  },
});

const uploadFile = multer({ storage: fileStorageEngineUpdate });

app.put("/assets/:id", uploadFile.fields([
  { name: 'image'},
  { name: 'doc_path'} 
]), (req, res, next) => {
      let tokenData = Token.decrypt(req.get('authorization')); 
      if (tokenData.token) {
        var tokenId =  req.params.id
        // console.log(req.files)
        if(tokenId && req.body.name && req.body.description && req.body.content) {
          var hashVal = f.hashFileSha256Async(`../public/doc/${tokenId}.xyz`,f.algorithmType.SHA256)
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
            if(typeof(req.files.image) !== "undefined" && typeof(req.files.doc_path) !== "undefined") {
              const sql = `
              UPDATE nftAssets SET name=?,description=?,content=?,metadata_path=?,image=?,doc_path=?,update_date=?  WHERE token_id=?`;
              db.run(sql, req.body.name, req.body.description, req.body.content, site+"/metadata/"+hexTokenId+".json", site+"/images/"+tokenId+".png",site+"/doc/"+tokenId+".xyz", Math.floor(Date.now() / 1000),tokenId, function(err,row){
                if (err) return next(err);
                res.json({code:200, message: 'Successfully completed',data:row})
              })
            } else if(typeof(req.files.image) !== "undefined") {
              const sql = `
              UPDATE nftAssets SET name=?,description=?,content=?,metadata_path=?,image=?,update_date=?  WHERE token_id=?`;
              db.run(sql, req.body.name, req.body.description, req.body.content, site+"/metadata/"+hexTokenId+".json", site+"/images/"+tokenId+".png",Math.floor(Date.now() / 1000),tokenId, function(err,row){
                if (err) return next(err);
                res.json({code:200, message: 'Successfully completed',data:row})
              })
            } else if(typeof(req.files.doc_path) !== "undefined") {
              const sql = `
              UPDATE nftAssets SET name=?,description=?,content=?,metadata_path=?,doc_path=?,update_date=?  WHERE token_id=?`;
              db.run(sql, req.body.name, req.body.description,req.body.content,site+"/metadata/"+hexTokenId+".json", site+"/doc/"+tokenId+".xyz",Math.floor(Date.now() / 1000),tokenId, function(err,row){
                if (err) return next(err);
                res.json({code:200, message: 'Successfully completed',data:row})
              })
            } else {
              const sql = `
              UPDATE nftAssets SET name=?,description=?,content=?,metadata_path=?,update_date=?  WHERE token_id=?`;
              db.run(sql, req.body.name, req.body.description,req.body.content,site+"/metadata/"+hexTokenId+".json", Math.floor(Date.now() / 1000),tokenId, function(err,row){
                if (err) return next(err);
                res.json({code:200, message: 'Successfully completed',data:row})
              })
            }
        } else {
          res.json({code:201, message: 'Incomplete parameters',data:[]})
        }
      }else{
         res.json({code:203, message: 'Login information has expired',data:[]})
      }
})

const fileStorageEngUpdatePrespectives = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, "./public/img"); 
  },
  filename: (req, file, cb) => {
    cb(null, Number(req.params.id)+'.png');
  },
});

const uploadPrespectivesImage = multer({ storage: fileStorageEngUpdatePrespectives });

app.put("/prespectives/:id", uploadPrespectivesImage.fields([
  { name: 'image'}
]), (req, res, next) => {
      let tokenData = Token.decrypt(req.get('authorization')); 
      if (tokenData.token) {
          if(typeof(req.files.image) !== "undefined") {
              if( req.params.id && req.body.title && req.body.description && typeof(req.files.image) !== "undefined" && req.body.url){
                  const sql = `UPDATE prespectives SET title=?,description=?,image=?,url=?,update_date=?,sort=?   WHERE id=?`;
                    db.run(sql, req.body.title, req.body.description,site+'/img/'+req.files.image[0].filename,req.body.url, Math.floor(Date.now() / 1000), req.body.sort?req.body.sort:0, req.params.id, function(err,row){
                      if (err) return next(err);
                      res.json({code:200, message: 'Successfully completed',data:row})
                    });
              }else{
                  res.json({code:201, message: 'Incomplete parameters',data:[]})
              }
          }else{
              if( req.params.id && req.body.title && req.body.description  && req.body.url){
                const sql = `UPDATE prespectives SET title=?,description=?,url=?,update_date=?,sort=?  WHERE id=?`;
                  db.run(sql, req.body.title, req.body.description,req.body.url, Math.floor(Date.now() / 1000),req.body.sort?req.body.sort:0,req.params.id, function(err,row){
                    if (err) return next(err);
                    res.json({code:200, message: 'Successfully completed',data:row})
                  });
              }else{
                  res.json({code:201, message: 'Incomplete parameters',data:[]})
              }
          }
      }else{
         res.json({code:203, message: 'Login information has expired',data:[]})
        
      }
})


app.get('/api/:apikey', async (req, res, next) => {
  if (req.params.apikey) {
    db.get('SELECT id, name, description, apiurl, apisql, create_date FROM subgraph_api WHERE apikey = ?', req.params.apikey, async (err,row)=>{
        if (err) return next(err);
        if(typeof(row) !== "undefined" ){
          await curveFinanceApi(row.apiurl, row.apisql).then((resThegraph)=>{
            res.json({code:200, message: 'Successfully',data:resThegraph.data})
          }).catch((err)=>{
            res.json({code:400, message: 'error: '+err,data:[]})
          })
        }else{
          res.json({code:201, message: 'Incomplete parameters',data:[]})
        }
    });
  }else{
    res.json({code:203, message: 'Login information has expired',data:[]})
  }
})

app.get('/subgraph', (req, res, next) => {
  db.all('SELECT id, name, description, apiurl, apisql, apikey, create_date FROM subgraph_api', async (err,row)=>{
      if (err) return next(err);
      console.log(111111111)
       res.json({code:200, message: 'Successfully completed',data:row})
  })
})

app.get('/subgraph/:id', async (req, res, next) => {
  if (req.params.id) {
    db.get('SELECT id, name, description, apiurl, apisql, apikey, create_date FROM subgraph_api WHERE id = ?', req.params.id, async (err,row)=>{
        if (err) return next(err);
        res.json({code:200, message: 'Successfully',data:row})
    });
  }else{
    res.json({code:203, message: 'Login information has expired',data:[]})
  }
})

app.post('/subgraph', uploadPrespectivesImage.fields([
  { name: 'image'}
]), (req, res, next) => {
  let tokenData = Token.decrypt(req.get('authorization')); 
  if (tokenData.token) {
    if(req.body.name && req.body.description && req.body.apiurl && req.body.apisql){
      const dateTime = Math.floor(Date.now() / 1000)
      const apiKeyStr = MD5(req.body.apiurl+dateTime)
      const sql = `
            INSERT INTO 
            subgraph_api(apikey,name,description,apiurl,apisql,create_date,update_date) 
            VALUES(?,?,?,?,?,?,?)`;
            db.run(sql, apiKeyStr, req.body.name, req.body.description, req.body.apiurl, req.body.apisql, dateTime, dateTime, function(err,row){
              if (err) return next(err);
              res.json({code:200, message: 'Successfully',data:row})
            });
    }else{
      res.json({code:201, message: 'Incomplete parameters',data:[]})
    }
  }else{
    res.json({code:203, message: 'Login information has expired',data:[]})
  }
})

app.put('/subgraph/:id', uploadPrespectivesImage.fields([
  { name: 'image'}
]), (req, res, next) => {
  let tokenData = Token.decrypt(req.get('authorization')); 
  if (tokenData.token) {
    if (req.params.id && req.body.name && req.body.description && req.body.apiurl && req.body.apisql) {
      const dateTime = Math.floor(Date.now() / 1000)
      const sql = `UPDATE subgraph_api SET name=?,description=?,apiurl=?,apisql=?,update_date=?  WHERE id=?`;
      db.run(sql, req.body.name, req.body.description,req.body.apiurl, req.body.apisql, dateTime,req.params.id, function(err,row){
        if (err) return next(err);
        res.json({code:200, message: 'Successfully',data:row})
      });
    }else{
      res.json({code:201, message: 'Incomplete parameters',data:[]})
    }
  }else{
    res.json({code:203, message: 'Login information has expired',data:[]})
  }
})

const connectApolloApi = (url) => {
  return  new ApolloClient({
    link: createHttpLink({
      uri: url,
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  })
}

const  curveFinanceApi = async (url, sql) => {
  return connectApolloApi(url).query({
      query: gql`
        ${sql}
      `,
    })
}

app.listen(port, function () {
  console.log('Express server running at http://127.0.0.1:'+port)
})