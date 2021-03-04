import React from 'react'

import { Link } from 'react-router-dom'

export const Navbar = () => {
  const logout=()=>{
    localStorage.setItem('username','');
    localStorage.setItem('password','');
    localStorage.setItem('authenticated','false');
    localStorage.setItem('role','');
  }
  if(localStorage.getItem('authenticated') === 'true'){
    return (
      <nav>
        <section>
          <h1>To Do List</h1>
          <div className="navContent">
            <div className="navLinks">
              <Link to="/missions">Missions</Link>
              <Link to="/login" onClick={logout}>Logout</Link>
            </div>
          </div>
        </section>
      </nav>
    )
  }else{
  return (
    <nav>
      <section>
        <h1>To Do List</h1>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/missions">Missions</Link>
          </div>
        </div>
      </section>
    </nav>
  )
  }
}
