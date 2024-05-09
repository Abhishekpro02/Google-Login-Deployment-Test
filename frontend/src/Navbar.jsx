import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={styles.navbarContainer}>
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <NavLink to="/" style={styles.navLink}>
              Home
            </NavLink>
          </li>
          <li style={styles.navItem}>
            <NavLink to="/profile" style={styles.navLink}>
              Profile
            </NavLink>
          </li>
          <li style={styles.navItem}>
            <NavLink to="/users" style={styles.navLink}>
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

const styles = {
  navbarContainer: {
    backgroundColor: "#430694",
    textAlign: "center",
    padding: "10px 5px",
  },
  navbar: {
    display: "inline-block",
  },
  navList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    display: "inline",
    margin: "0 20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
  },
};
