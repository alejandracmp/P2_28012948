const express = require('express');
const router = express.Router();
const passport = require ('passport');
const session = require('express-session');
const GoogleStrategy = require ('passport-google-oauth').OAuth2Strategy;
const fetch = require ('node-fetch')
var sqlite3 = require('sqlite3').verbose();
require('dotenv').config();


const db = new sqlite3.Database('./routes/mock.db',sqlite3.OPEN_READWRITE,(err)=>{
  if(err) return console.error(err.message);
  console.log("connection successful")
})

router.get('/', (req, res) => {
  res.render('index', { title: 'First Web Node' });
});


router.get('/login', function(req, res,) {
  res.render('login');
});


const testu= process.env.USUARIO;
const testp = process.env.CONTRA;

router.post('/login', (req,res) => {
	 var usuario=req.body.usuario;
	  var contra=req.body.contra;
		console.log(usuario,contra)
	if (usuario === testu && contra === testp) {
	
	res.redirect('/contactos')
	}else{
		res.send("Usuario no autorizado")
	}
	
});


router.use(session(
  {
  secret: 'cat secret',
  resave: false,
  saveUninitialized: true,
}
));
router.use(passport.authenticate('session'));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


router.get('/login/federated/google', passport.authenticate('google'));

passport.use(new GoogleStrategy(
  {
    clientID: "816046517947-tp7hnksarimf3ud9ioj9kck5fth2ffai.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://prueba02ale.herokuapp.com/google/callback",
  scope: [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  ],
  session: false,
  },
  function (accessToken, refreshToken, profile, done) {
  console.log(profile); 
  done(null, profile)
          }
      )
    );



  router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/contactos',
  failureRedirect: '/login'
  
        }
    )
);



router.get('/redirect/google', passport.authenticate('google', {
  successRedirect: '/contactos',
  failureRedirect: '/login'
}));






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

  //let body= req.body;


  let cacha;
  	const requi = req.body['g-recaptcha-response']
	const priv = process.env.CPRIV;
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${priv}&response=${requi}`;
	fetch(url, {
    method: 'post',
 	})
    .then((response) => response.json())
    .then((google_response) => {
      if (google_response.success == true) {		
		console.log('Captcha resuelto'); 
	
    const sql='INSERT INTO comentarios (nombre, correo, ip, comentario,fecha) VALUES(?,?,?,?,?)';

	db.run(sql,
    [nombre,correo,ip,comentario,dateTime],
    (err) => {
      if(err) return console.error(err.message);})	}})


 /**db.run(
  'CREATE TABLE comentarios (nombre, correo, ip, comentario,fecha)'
);*/


 res.redirect('/');

}


)

//res.send(console.log({message:'success'}))


/*db.close((err) =>{
  if (err) return console.error(err.message);
}

)*/




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
