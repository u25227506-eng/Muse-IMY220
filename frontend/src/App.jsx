import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import AlbumPage from "./pages/AlbumPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
        <Route path="/album/:id" element={<ProtectedRoute><AlbumPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;