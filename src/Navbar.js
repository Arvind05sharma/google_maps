import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [navbar, setNavbar] = useState(false);

  const closeMobileMenu = () => setClick(false);

  const changebackground = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changebackground);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Map 1
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/react-google-maps-1"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Map 2
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/react-google-maps-2"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Map 3
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
