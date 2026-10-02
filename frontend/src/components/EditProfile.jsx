import {useState} from "react";

function EditProfile({user, onSave}) {
    const [bio, setBio] = useState(user.bio);
    const [username, setUsername] = useState(user.username);

    async function handleSubmit(e){
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({ username, bio, avatarUrl: user.avatarUrl }),
        });
        const updated = await response.json();
        onSave(updated);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white rounded-2xl shadow-sm p-5 max-w-sm mx-auto my-4">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <textarea
                value={bio}
                onChange={(e) =>setBio(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 bg-muse-cream focus:outline-none focus:ring-2 focus:ring-muse-mauve"
            />
            <button type="submit" className="px-4 py-2 rounded-full bg-muse-mauve text-muse-cream font-medium hover:bg-muse-dark transition-colors">
                Save Changes
            </button>
        </form>
    );
}

export default EditProfile;