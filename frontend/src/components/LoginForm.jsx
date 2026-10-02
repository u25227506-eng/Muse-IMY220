import {useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginForm(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    function validate(){
        const newErrors = {};
        if (!email.includes("@")) newErrors.email = "enter valid email address";
        if (password.trim().length === 0) newErrors.password = "password cannot be empty";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e){
        e.preventDefault();
        if (validate()){
            const response = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({email, password}),
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

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm w-full max-w-sm">
            <h2 className="font-display text-xl text-muse-dark mb-1">Log In</h2>
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
            {errors.form && <p className="text-sm text-rose-500">{errors.form}</p>}

            <button type="submit" className="mt-2 px-4 py-2 rounded-full bg-muse-mauve text-muse-cream font-medium hover:bg-muse-dark transition-colors">
                Log In
            </button>
        </form>
    );
}

export default LoginForm;