import React from 'react'

import { Link } from 'react-router-dom'

export const Navbar = () => {
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
