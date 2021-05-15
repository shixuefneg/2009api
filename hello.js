const express = require("express")
const mysql = require("mysql")
const bodyParser = require('body-parser')


const app = express()
const port = 3001

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//处理跨域
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    next();
});



const connection = mysql.createConnection({
    host     : 'localhost',         //数据库地址
    user     : 'root',              //数据库用户名
    password : 'root',            // 数据库密码
    database : 'api2009'              // 数据库名
});

connection.connect()

app.get('/',(req,res)=>{
    console.log(req.query)
    res.send("API 接口11111")
})

app.get('/user/list',(req,res)=>{
    //拼装sql语句
    let sql = "select user_id,user_name,email,password from p_users order by user_id desc limit 10"

    connection.query(sql, function (error, results, fields) {
        res.send(results)           //将数据库查询结果返回给接口
    });
})

//用户添加
app.post('/user/add',(req,res)=>{
    //接收 post数据
    console.log(req.body)
    let user_id = req.body.user_id
    let user_name = req.body.user_name

    //入库  insert into
    let sql = `insert into p_users (user_id,user_name) values (${user_id},"${user_name}")`
    connection.query(sql, function (error, results, fields) {
        res.send("添加成功")
    });
})


// goodslist
app.get('/goods/list',(req,res)=>{
    let sql = `select goods_id,goods_name,shop_price,number from p_cart limit 5`
    connection.query(sql, function (error, results, fields) {
        res.send(results)
    });
})
//用户注册接口
app.post('/check/add',(req,res)=>{
  //接收 post数据
  let username=req.body.username
  let useremail=req.body.useremail
  let mobile=req.body.mobile
  let pass1=req.body.pass1
  // console.log(user_name)
  // console.log(user_email)
  // console.log(mobile)
  // console.log(password1)
  let sql=`insert into p_users(user_name,email,mobile,password) values ("${username}","${useremail}",${mobile},"${pass1}")`
  console.log(sql)
  connection.query(sql,function(error,results,fields){
    console.log(results)
    console.log("受影响的行数： ",results.affectedRows)


    if(results.affectedRows>0){   //以受影响行数判断是否注册成功  
      res.send("注册成功")
    }else{                        
      res.send("注册失败")
    }
});
})

//检测用户名
app.get("/check/username",(req,res)=>{
    console.log(req.query)
    let sql = `select * from p_users where user_name='${req.query.name}'`
    console.log("sql: ",sql)
    connection.query(sql, function (error, results, fields) {

        console.log("数据库记录： ",results)

       if(results.length>0){        //已被占用
           let response_data = {
               errno: 40005,
               msg: "用户名已被占用"
           }
           res.send(response_data)
       }else{           // 可以使用
           let response_data = {
               errno: 0,
               msg: "ok"
           }
           res.send(response_data)
       }

    });
})

//检查邮箱是否已存在
app.get("/check/email",(req,res)=>{
  let email=req.query.email
  let sql=`select * from p_users where email ='${email}'`
  console.log("sql",sql);
  connection.query(sql, function (error, results, fields) {
    console.log("数据库记录",results)
    if(results.length>0){
      let response_dat={
        error:4006,
        msg:'邮箱已被占用',
      }
      res.send(response_dat) //已被占用
    }else{
      let response_dat={
        error:0,
        msg:'ok',
      }
      res.send(response_dat)  //可以使用
    }
  });
})
//检查手机号是否已存在
app.get("/check/mobile",(req,res)=>{
  let mobile=req.query.mobile
  let sql=`select * from p_users where mobile ='${mobile}'`
  console.log("sql",sql);
  connection.query(sql, function (error, results, fields) {
    console.log("数据库记录",results)
    if(results.length>0){
      let response_dat={
        error:4006,
        msg:'手机号已被占用',
      }
      res.send(response_dat) //已被占用
    }else{
      let response_dat={
        error:0,
        msg:'ok',
      }
      res.send(response_dat)  //可以使用
    }
  });
})

//监听端口
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})