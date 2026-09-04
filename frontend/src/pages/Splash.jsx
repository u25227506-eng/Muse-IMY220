import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function Splash(){
    return(
        <div>
            <h1>Muse</h1>
            <LoginForm />
            <SignupForm />
        
        </div>
    );
}

export default Splash;