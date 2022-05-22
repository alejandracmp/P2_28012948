const express = require('express');
const router = express.Router();

var sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./routes/mock.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
  console.log("connection successful")
})

router.get('/', (req, res) => {
  res.render('index', { title: 'First Web Node' });
});
router.post("/comentario",(req,res)=>{

  console.log(req.body)
  console.log(req.socket.remoteAddress)
let ip = req.socket.remoteAddress
let correo = req.body.user_mail
let comentario = req.body.user_message
let nombre =req.body.user_name


var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

  let body= req.body;

const sql='INSERT INTO comentarios (nombre, correo, ip, comentario,fecha) VALUES(?,?,?,?,?)';
 /**db.run(
  'CREATE TABLE comentarios (nombre, correo, ip, comentario,fecha)'
);*/

db.run(
sql,
[nombre,correo,ip,comentario,dateTime],
(err) => {
  if(err) return console.error(err.message);

}
)
/** 
db.close((err) =>{
  if (err) return console.error(err.message);
})**/



})
router.get('/contactos', (req, res) => {

  const sql = 'SELECT * FROM comentarios' 

  db.all(sql,[],(err,rows)=>{
    if(err) return console.error(err.message);

    rows.forEach((row)=>{
      console.log(row);
      console.log('a')
    res.render('contactos',{ data: JSON.stringify(rows) });
 
    });
  });

});

module.exports = router;
