import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;