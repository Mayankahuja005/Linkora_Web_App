import React from "react"
import { Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./layout/Layout"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import MyConnections from "./pages/MyConnections"
import Logout from "./pages/Logout"
import ProtectedRoute from"./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import Pending from "./pages/Pending"
function App(){
    return(
        <div>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                    <Route path="/my-connection" element={<ProtectedRoute><MyConnections/></ProtectedRoute>}/>
                    <Route path="/pending" element={<ProtectedRoute><Pending/></ProtectedRoute>}/>
                </Route>
                <Route path="/signup" element={<PublicRoute><Signup/></PublicRoute>}/>
                <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
                <Route path="/logout" element={<ProtectedRoute><Logout/></ProtectedRoute>}/>
            </Routes>
        </div>
    )
}
export default App