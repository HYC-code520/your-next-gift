import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink> {/* Link to Home Page */}
      <NavLink to="/add-diy">Add DIY Project</NavLink> {/* Link to Add DIY Page */}
    </nav>
  );
}

export default NavBar;
