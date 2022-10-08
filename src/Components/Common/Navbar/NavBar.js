import React from 'react';
import { navbarItems } from './NavbarItems';
import './NavBar.css'
import { useState } from 'react';

const Navbar = () => {

    const [isClicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!isClicked);
    }
    

  return (
    <nav className='navbar'>
        <h1 className="navbar-logo">Calorie Calendar</h1>
        <div className="menu-icon" onClick={handleClick}>
            <i className={isClicked ? 'fas fa-times' : 'fas fa-bars'}/>
        </div>
        <ul className={`navbar-items ${isClicked ? 'active' : ''}`}>
            {navbarItems.map((item, index) => {
                return (
                    <li key={index} className='navbar-item'>
                        <a className={item.cName} href={item.url}>
                            {item.title}
                        </a>
                    </li>
            )})}
        </ul>
    </nav>
  )
}

export default Navbar