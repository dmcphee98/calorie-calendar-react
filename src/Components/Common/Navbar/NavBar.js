import React from 'react';
import { navbarItems } from './NavbarItems';
import './NavBar.css'
import { useState } from 'react';

const Navbar = ({ activePageIndex, setActivePageIndex }) => {

    const [trayIsOpen, traySetOpen] = useState(false);

    const logoColors = ['#000000', '#c4e874', '#a4e1ff', '#9487ec', '#fc7e7a', '#c4e874'];

    const handleClick = () => {
        traySetOpen(!trayIsOpen);
    }

  return (
    <nav className='navbar'>
        <div className='navbar-logo-container'>
            <h1 
                className="navbar-logo" 
                onClick={() => setActivePageIndex(1)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        setActivePageIndex(1);
                        document.getElementById("start-tab-point").focus();
                    }
                }}
                style={{color: logoColors[activePageIndex]}} 
                tabIndex={2}
                >
                CalorieCast
            </h1>
        </div>
        <div className="burger-icon-container" onClick={handleClick}>
            <i className={`burger-icon ${trayIsOpen ? 'fas fa-times' : 'fas fa-bars'}`}/>
        </div>
        <ul className={`navbar-items ${trayIsOpen ? 'tray-open' : ''}`}>
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