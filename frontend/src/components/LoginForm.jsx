import {useState} from "react";

function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    function validate(){
        const newErrors = {};

        if (!email.includes("@")){
            newErrors.email = "enter valid email address";
        }

        if (password.trim().length === 0){
            newErrors.password = "password cannot be empty";
        }

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
            console.log("Server response:", data);
        }
        
    }

    return (
        <form onSubmit={handleSubmit}>
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

            <button type="submit">Log In</button>
        </form>
    );
}

export default LoginForm;

