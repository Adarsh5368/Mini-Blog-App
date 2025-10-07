import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Blog from "./Components/Blog";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AddBlog from "./Components/AddBlog";
import MyBlogs from "./Components/MyBlogs";
import Profile from "./Components/Profile";
import ProfileSetup from "./Components/ProfileSetup";
import MainLayout from "./Components/MainLayout";
import BlogDetail from "./Components/BlogDetail";

function App() {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [auth]);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout user={user} />}>
                    <Route path="/" element={user ? <Blog /> : <Navigate to="/login" />} />
                    <Route path="/add-blog" element={user ? <AddBlog /> : <Navigate to="/login" />} />
                    <Route path="/my-blogs" element={user ? <MyBlogs /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/setup-profile" element={user ? <ProfileSetup /> : <Navigate to="/login" />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                </Route>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;