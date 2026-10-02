import {useState} from "react";
import {useNavigate} from "react-router-dom";

function SignupForm(){
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    function validate(){
        const newErrors = {};
        if (username.trim().length < 3) newErrors.username = "username must be at least 3 characters";
        if (!email.includes("@")) newErrors.email = "enter valid email address";
        if (password.length < 8) newErrors.password = "password must be at least 8 characters";
        if (password !== confirmPassword) newErrors.confirmPassword = "passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e){
        e.preventDefault();
        if (validate()){
            const response = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({username, email, password}),
            });
            const data = await response.json();
            if (response.ok){
                localStorage.setItem("museUser", JSON.stringify(data.user));
                navigate("/home");
            }else{
                setErrors({form: data.message});
            }
        }
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm w-full max-w-sm">
            <h2 className="font-display text-xl text-muse-dark mb-1">Sign Up</h2>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) =>setUsername(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 focus:outline-none focus:ring-2 focus:ring-muse-mauve bg-muse-cream"
            />
            {errors.username && <p className="text-sm text-rose-500">{errors.username}</p>}

            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) =>setEmail(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 focus:outline-none focus:ring-2 focus:ring-muse-mauve bg-muse-cream"
            />
            {errors.email && <p className="text-sm text-rose-500">{errors.email}</p>}

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) =>setPassword(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 focus:outline-none focus:ring-2 focus:ring-muse-mauve bg-muse-cream"
            />
            {errors.password && <p className="text-sm text-rose-500">{errors.password}</p>}

            <input
                type="password"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) =>setConfirmPassword(e.target.value)}
                className="px-4 py-2 rounded-lg border border-muse-pink/50 focus:outline-none focus:ring-2 focus:ring-muse-mauve bg-muse-cream"
            />
            {errors.confirmPassword && <p className="text-sm text-rose-500">{errors.confirmPassword}</p>}
            {errors.form && <p className="text-sm text-rose-500">{errors.form}</p>}

            <button type="submit" className="mt-2 px-4 py-2 rounded-full bg-muse-mauve text-muse-cream font-medium hover:bg-muse-dark transition-colors">
                Sign Up
            </button>
        </form>
    );
}

export default SignupForm;