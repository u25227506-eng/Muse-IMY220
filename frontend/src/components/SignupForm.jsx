import {useState} from "react";

function SignupForm(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    function validate(){
        const newErrors = {};

        if (username.trim().length < 3){
            newErrors.username = "username must be at least 3 characters";
        }

        if (!email.includes("@")){
            newErrors.email = "enter valid email address";
        }

        if (password.length < 8){
            newErrors.password = "password must be at least 8 characters";
        }

        if (password !== confirmPassword){
            newErrors.confirmPassword = "passwords do not match";
        }

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
            console.log("Server response:", data);
        }
        
    }

    return(
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) =>setUsername(e.target.value)}
            />
            {errors.username && <p>{errors.username}</p>}

            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) =>setEmail(e.target.value)}
            />
            {errors.email && <p>{errors.email}</p>}

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) =>setPassword(e.target.value)}
            />
            {errors.password && <p>{errors.password}</p>}

            <input
                type="password"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) =>setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

            <button type="submit">Sign up</button>
        </form>
    );
}

export default SignupForm;