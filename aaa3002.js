const express = require('express')
const mysql = require('mysql'); 
const app = express()
const port = 3002


const connection = mysql.createConnection({
  host     : 'localhost',         //数据库地址
  user     : 'root',              //数据库用户名
  password : 'root',            // 数据库密码
  database : 'api2009'              // 数据库名
});

//设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-type",);
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
//建立连接
connection.connect();



app.get('/goods/list', (req, res) => {
      //拼装sql语句
    let sql = "select goods_name,shop_price,number from p_cart order by goods_id desc limit 5"

    //执行查询
    connection.query(sql, function (error, results, fields) {
      console.log(error);
      
        res.send(results)
    });
 })

 //删除用户信息
 app.delete('/goods/delete',(req,res)=>{
  let uid=req.query.uid
  let sql=`delete from p_users where goods_id=${uid}`
  connection.query(sql, function (error, results, fields) {
    res.send("删除成功")
  });
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})