import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function Splash(){
    return(
        <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-muse-cream via-muse-pink/30 to-muse-mauve/40 px-4 py-10">
            <h1 className="font-display text-5xl font-bold text-muse-dark tracking-wide">Muse</h1>
            <p className="text-muse-dark/70 max-w-md text-center">Share your art, your moments, your story.</p>
            <div className="flex flex-col md:flex-row gap-6">
                <LoginForm />
                <SignupForm />
            </div>
        </div>
    );
}

export default Splash;