import { NavLink } from "react-router-dom"

function NavBar(){
    return <nav>
    <NavLink to="/" >Home</NavLink>    
    <NavLink to="/add-diy">Add diy</NavLink>
    </nav>
}

export default NavBar