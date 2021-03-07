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
            const response = await fetch('https://frozen-ridge-44289.herokuapp.com/tryregister',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json'
            },
              body:JSON.stringify({username:username,password:password})
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
          <label htmlFor="username">Username:</label>
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
          <label htmlFor="password">Password:</label>
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
         <Link to='/'>Login</Link>
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