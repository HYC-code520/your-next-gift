import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink> {/* Link to Home Page */}
      <NavLink to="/list">List</NavLink> 
      <NavLink to="/request-form">Form</NavLink> {/* Link to form Page where my friend can request what they want for their BD */}
      <NavLink to="/faq">FAQ</NavLink> 
      <NavLink to="/about">About</NavLink> 
      <NavLink to="/blog">Blog</NavLink> 
    </nav>
  );
}

export default NavBar;
