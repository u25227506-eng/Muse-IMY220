import {Link} from "react-router-dom";
import {useState} from "react";


function EditProfile({user}) {
    const [bio, setBio] = useState(user.bio);
    const [username, setUsername] = useState(user.username);

    function handleSubmit(e){
        e.preventDefault();
        console.log("Updated profile:", {username, bio});

    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <textarea
                value={bio}
                onChange={(e) =>setBio(e.target.value)}
            />
            <button type="submit">Save Changes</button>
        </form>
    );
}


export default EditProfile;