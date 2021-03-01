const express = require('express');
const cookieSession = require("cookie-session");
const path = require('path');
const cookieParser = require("cookie-parser");
const app = express();
const passport = require('passport')
const port = 4002;
const session = require("express-session");
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TodoList',
  password: 'postgres',
  port: 5432,
})
require('./passportConfigure')(passport,pool);
const SESSION = {
    COOKIE_KEY: "thisappisawesome"
  };
let cors = require('cors');
let bodyParser = require('body-parser')
app.use(express.json());
const publicPath = path.join(__dirname, '..', '/build');
console.log(publicPath);
app.use(express.static(publicPath));

const corsOptions = {
    origin: '*',   
    methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
    credentials: true,               
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept",
  }
app.options('*', cors(corsOptions))
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(
    cookieSession({
      name: "session",
      keys: [SESSION.COOKIE_KEY],
      maxAge: 24 * 60 * 60 * 100
    })
  );
  app.post('/register',(req,res)=>{
      pool.query('INSERT INTO users(username,password) VALUES($1,$2)',[req.body.username,req.body.password],(error,results)=>{
          if(error){
              console.log(error);
              res.json({msg:'username already exists'})
          } else{
              res.json({msg:'new user created'});
          }
      })
  })
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
 });
 

  app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log(req.user);
    console.log(req.user.fail);
    if(req.user.fail === 'failed'){
        res.status(201).json({
            authenticated: false,
            message: "failed to login",
            user: req.user,
            role:req.role,
            cookies: req.cookies
          });
    }else{
        res.status(200).json({
            authenticated: true,
            message: "user successfully authenticated",
            user: req.username,
            role:req.params.role,
            cookies: req.cookies
          });
    }
  });


  
  // if it's already login, send the profile response,
  // otherwise, send a 401 response that the user is not authenticated
  // authCheck before navigating to home page
  app.get("/login1", (req, res) => {
      console.log('fail');
    res.status(401).json({
      authenticated: false,
      message: "failed to login",
      user: req.user,
      role:req.role,
      cookies: req.cookies
    });
  });
  app.get("/missions/:role",(req, res) => {
      console.log('enter');
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.username,
      role:req.params.role,
      cookies: req.cookies
    });
  });

app.post('/addmission', (req, res) => {
  pool.query('INSERT INTO missions(id,date,title,content,username) VALUES($1,$2,$3,$4,$5)',[req.body.id,req.body.date,req.body.title,req.body.content,req.body.user],(error,results)=>{
      if(error){
          console.log(error);
      }
  });
  pool.query('SELECT * FROM missions',[],(error,results)=>{
    if(error){
        res.send({js:'failed to send'});
    } else{
        res.send({js:results.rows});
    }
  });
  
});
app.post('/getmissions', (req, res) => {
    console.log(req.body.role);
  if(req.body.role ==='admin' && req.body.auth){
    pool.query('SELECT * FROM missions',[],(error,results)=>{
        if(error){
            console.log(error);
            res.send({js:'failed to send'});
        } else{
            res.send({js:results.rows});
        }
      });
  }else if(req.body.auth){
  pool.query('SELECT * FROM missions WHERE username=$1',[req.body.username],(error,results)=>{
    if(error){
        console.log(error);
        res.send({js:'failed to send'});
    } else{
        res.send({js:results.rows});
    }
  });
} else{
    res.send({js:'failed to send'});
}
});

  app.post('/deletemission',(req,res)=>{
      pool.query('DELETE FROM submissions WHERE mission_id=$1',[req.body.id],(error,results)=>{
          if(error){
              res.send({msg:'fail'});
          }
      })
    pool.query('DELETE FROM missions WHERE id=$1',[req.body.id],(error,results)=>{
        if(error){
            res.send({msg:'didnt found'});
        }else{
            res.send({msg:'deleted'});
        }
    });
  });
  app.post('/getspecificmission',(req,res)=>{
      console.log(req.body.auth);
      if(req.body.auth === 'true'){
          console.log(req.body.auth);
        pool.query('SELECT * FROM missions WHERE id=$1',[req.body.id],(error,results)=>{
            if(error){
                res.send({msg:'didnt found'});
            } else{
                res.send({result:results.rows});
            }
        });
    }else{
        res.send({msg:'no access'});
    }
  });
  

app.post('/updatemission',(req,res) =>{
    pool.query('UPDATE missions SET title =$1,content =$2 WHERE id=$3',[req.body.title,req.body.content,req.body.id],(error,results)=>{
        if(error){
            res.send({response:'failed'});
        } else{
            res.send({response:'updated succefully'});
        }
    });
});
app.post('/addsubmission', (req, res) => {
  pool.query('INSERT INTO submissions(mission_id,item,submission_id) VALUES($1,$2,$3)',[req.body.id,req.body.submission,req.body.item],(error,results)=>{
      if(error){
          console.log(error);
          res.send({response:'failed'});
      } else{
          res.send({response:'added'});
      }
  });
});
app.post('/getsubmissions',(req,res)=>{
    pool.query('SELECT * FROM submissions WHERE mission_id=$1',[req.body.id],(error,results)=>{
        if(error){
            console.log(error);
            res.send({response:'failed to send'});
        } else{
            let ar =[];
            let ids = [];
            let i=0;
            while(i<results.rows.length){
                ar.push(results.rows[i].item);
                ids.push(results.rows[i].submission_id);
                i++;
            }
            res.send({response:ar,id:ids});
        }
      });
});
app.post('/deletesubmission',(req,res)=>{
    pool.query('DELETE FROM submissions WHERE submission_id=$1',[req.body.id],(error,results)=>{
        if(error){
            console.log(error);
            res.send({msg:'didnt found'});
        }else{
            console.log(results.rows);
            res.send({msg:'deleted'});
        }
    });
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});