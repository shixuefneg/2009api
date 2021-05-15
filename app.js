const express = require('express')
const mysql = require('mysql');
const bodyParser = require('body-parser')
const app = express()
const port = 3001

//根据具体情况 添加或删除部分字段
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    next();
});



app.use(bodyParser.json())



const connection = mysql.createConnection({
  host     : 'localhost',         //数据库地址
  user     : 'root',              //数据库用户名
  password : 'root',            // 数据库密码
  database : 'api2009'              // 数据库名
});

//建立连接
connection.connect();

//返回3000端口
app.get('/', (req, res) => {
  res.send('Hello World!')
})




//查看数据库数据
app.get('/user/list', (req, res) => {
      //拼装sql语句
    let sql = "select user_id,user_name,email from p_users order by user_id desc limit 10"

    //执行查询
    connection.query(sql, function (error, results, fields) {
        res.send(results)
    });
 })

 //删除用户信息
 app.delete('/user/delete',(req,res)=>{
    let uid=req.query.uid
    let sql=`delete from p_users where user_id=${uid}`
    connection.query(sql, function (error, results, fields) {
      res.send("删除成功")
    });
 })

 //添加用户
 app.post('/user/add',(req,res)=>{

  //接受 post数据
  console.log(req.body)
  let user_id=req.body.user_id
  let user_name=req.body.user_name

  //向库中添加数据
  let sql=`insert into p_users(user_id,user_name) values (${user_id},"${user_name}")`
      connection.query(sql, function (error, results, fields) {
        res.send("添加成功")
      });
 })


 //更新用户信息
 app.put('/user/update',(req,res)=>{
   console.log(req.body)
   let user_id=req.body.user_id
   let user_name=req.body.user_name
   let  sql=`update  p_users set user_name='${user_name}' where user_id=${user_id}`
   console.log(sql)
    connection.query(sql, function (error, results, fields) {
      console.log(error)
      res.send("修改成功")
    });

 })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})