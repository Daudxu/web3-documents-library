// API
const express = require('express')
const compression = require('compression')
const cors = require('cors');
// Import modules
// const redisConnection = require('./src/utils/redis/redisConnection')
// const swaggerDoc = require('./swagger/swaggerDoc')
// const jwtAuth = require('./src/utils/jwt')
const Routers = require('./src/routes/index')
const logRecode = require('./log/index')

// Init
const app = express()

app.use(compression())
// 后端解决跨域导入cors包

// 解决跨域
app.use(cors()); 


// log
app.use(logRecode)
app.use(express.static(__dirname + '/public'))

// 允许跨域
// 解决跨域问题
app.all("*",function(req,res,next){
    // 设置允许跨域的域名,*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin','*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers','content-type');
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods','DELETE,PUT,POST,GET,OPTIONS');
    if(req.method.toLowerCase() == 'options')
        res.send(200); // 让options 尝试请求快速结束
    else
        next();
})

// app.all('*', function(req, res, next) {
//   // console.log(req.headers.origin)
//   // console.log(req.environ)
// //   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   var origin = req.headers.origin;
//   // console.log(origin)
// if (typeof(origin) === 'undefined') {
//     res.header('Access-Control-Allow-Origin', '*'); 
// } else {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
// }


//   res.header("Access-Control-Allow-Headers", '*');
//   res.header("Access-Control-Allow-Method", '*');
//   res.header("Access-Control-Allow-Credentials", 'true');
//   res.header("X-Powered-By",' 3.2.1')
//   if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
//   else  next();
// });


// JWT
// app.use(jwtAuth)
// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).send(err.message);
//   }
// });

Routers(app)
const port = 3001
app.listen(port, function (){
  console.log('Example app listening on port '+port+'!');
  console.log(`Your application is running here: http://localhost:${port}`)
});
