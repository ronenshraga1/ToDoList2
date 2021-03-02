/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import React from 'react';
import { useHistory,Link } from 'react-router-dom';
let CryptoJS = require("crypto-js");
const dotenv = require('dotenv');


export const Login=()=>{
    const[username,SetUserName] = useState('');
    const[password,SetPassword] = useState('');
    const [show, setShow] = useState(false);
    const history = useHistory();
    const OnUserNameChange =(e) => SetUserName(e.target.value);
    const OnPasswordChange =(e) => SetPassword(e.target.value);
    const SendRequest = async() =>{
      dotenv.config();
      console.log(process.env.REACT_APP_KEY_ENCRYPT)
        try{
            const response = await fetch('http://localhost:5000/login',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json'
            },
              body:JSON.stringify({username:username,password:CryptoJS.AES.encrypt(password, process.env.REACT_APP_KEY_ENCRYPT).toString()})
            });
            if(response.ok){
              const jsonResponse = await response.json();
              console.log(jsonResponse.authenticated);
              if(jsonResponse.authenticated){
                console.log(jsonResponse.role);
                  localStorage.setItem('username',username);
                  localStorage.setItem('password',password);
                  localStorage.setItem('role',jsonResponse.role);
                  localStorage.setItem('authenticated','true');
                  history.push('/missions');
              } else{
                setShow(true);
              }
            }else{
            throw new Error('request failed');
          }
          }catch(error){
            console.log(error);
          }
    }
    const onLoadSend = async() =>{
        if(username ==='' && password==='' || username ==='' || password===''){
            SetUserName(localStorage.getItem('username'));
            SetPassword(localStorage.getItem('password'));
        }
        console.log(localStorage.getItem('username'));
        console.log(username);
        console.log(localStorage.getItem('password'));
        try{
            const response = await fetch('http://localhost:5000/login',{
              method:'POST',
              headers: {
                'Content-Type': 'application/json'
            },
              body:JSON.stringify({username:localStorage.getItem('username'),password:CryptoJS.AES.encrypt(localStorage.getItem('password'), process.env.REACT_APP_KEY_ENCRYPT).toString()})
            });
            if(response.ok){
              const jsonResponse = await response.json();
              console.log(jsonResponse.authenticated);
              if(jsonResponse.authenticated){
                  localStorage.setItem('authenticated',true);
                  localStorage.setItem('role',jsonResponse.role);
                  history.push('/missions');
              } else{
                setShow(true);
              }
            }else{
            throw new Error('request failed');
          }
          }catch(error){
            console.log(error);
          }
    }
    useEffect(()=>{
       if(localStorage.getItem('username') !== ''){
        onLoadSend();
       }
        
    },[])
    return(
        <section>
        <h2>Login</h2>
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
            value={username}
            size="30"
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
          <Link to='/register'>Register</Link>
          <h6></h6>
          <button className="button" type="button" onClick={SendRequest}>
            Login
          </button>
          {show?(<h4 style={{color:"red"}}>check your password and username again</h4>):null}
        </form>
      </section>
  
    );
}