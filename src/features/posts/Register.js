import { useEffect, useState } from "react";
import React from 'react';
import { useHistory,Link } from 'react-router-dom';
let CryptoJS = require("crypto-js");


export const Register=()=>{
    const[username,SetUserName] = useState('');
    const[password,SetPassword] = useState('');
    const [fail, Setfail] = useState(false);
    const [success, setSuccess] = useState(false);
    const history = useHistory();
    const OnUserNameChange =(e) => SetUserName(e.target.value);
    const OnPasswordChange =(e) => SetPassword(e.target.value);
    const SendRequest = async() =>{
        try{
            const response = await fetch('http://localhost:5000/register',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json'
            },
              body:JSON.stringify({username:username,password:CryptoJS.AES.encrypt(password, process.env.REACT_APP_KEY_ENCRYPT).toString()})
            });
            console.log(response.ok);
            if(response.ok){
              const jsonResponse = await response.json();
              console.log(jsonResponse.authenticated);
              if(jsonResponse.msg ==='new user created'){
                console.log(jsonResponse.role);
                Setfail(false);
                setSuccess(true);
              } else{
                Setfail(true);
              }
            }else{
            throw new Error('request failed');
          }
          }catch(error){
            console.log(error);
          }
    }
    useEffect(()=>{    
    },[])
    return(
        <section>
        <h2>Register</h2>
        <form>
          <br></br>
          <br></br>
          <label htmlFor="username">Username:</label>
          <br></br>
          <br></br>
          <input
            type="text"
            id="username"
            name="username"
            placeholder=""
            size="30"
            value={username}
            onChange={OnUserNameChange}
            required
          />
          <br></br>
          <br></br>
          <label htmlFor="password">Password:</label>
          <br></br>
          <br></br>
          <input
            type="password"
            id="password"
            name="password"
            placeholder=""
            minLength="8"
            size="30"
            value={password}
            onChange={OnPasswordChange}
            required
          />
          <br></br>
          <br></br>
         <Link to='/'>Login</Link>
         <br></br>
          <br></br>
         <h6></h6>
          <button className="button" type="button" onClick={SendRequest}>
            Register
          </button>
          {fail?(<h4 style={{color:"red"}}>check your password and username again</h4>):null}
          {success?(<h4 style={{color:"green"}}>user created</h4>):null}
        </form>
      </section>
  
    );
}