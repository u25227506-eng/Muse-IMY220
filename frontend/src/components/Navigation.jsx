import {Link} from "react-router-dom";

function Navigation(){
    return (
        <nav> 
            <Link to="/home">Muse</Link>
            <Link to="/home">Home</Link>
            <Link to="/profile/1">Profile</Link>
        </nav>
    );
}

export default Navigation;