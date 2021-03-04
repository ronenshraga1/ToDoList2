const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  const CryptoJS = require("crypto-js");

  
  module.exports = (passport,db) =>{
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user)
      });
    passport.use(new LocalStrategy(
  function(username, password, done) {
    db.query('SELECT username, password,role FROM users WHERE username=$1',[username],(error,result)=>{
    if(result.rows.length >0){
        const first = result.rows[0];
        const passwordbytes =CryptoJS.AES.encrypt(first.password, 'agsfarfsbfggfsajrsrj1');
        if(CryptoJS.AES.decrypt(password, 'agsfarfsbfggfsajrsrj1').toString(CryptoJS.enc.Utf8) === first.password && first.role==='admin'){
            done(null,{username:first.username,pass:first.password,role:'admin'});
        } else if(CryptoJS.AES.decrypt(password, 'agsfarfsbfggfsajrsrj1').toString(CryptoJS.enc.Utf8) === first.password){
            done(null,{username:first.username,pass:first.password,role:'user'});
        }else{
            done(null,{fail:'failed'});
        }
    } else{
        done(null,{fail:'failed'});
    }
    })
    }));

}
  
