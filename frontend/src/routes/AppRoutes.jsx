import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Unauthorized from "../pages/Unauthorized"

import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"
import SportsManagement from "../pages/admin/SportsManagement"

import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"

import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"
import Profile from "../pages/user/Profile"

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
                    <Route path="dashboard" element={<UserDashboard />} />
                </Route>

                <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
                    <Route path="dashboard" element={<CoachDashboard />} />
                </Route>

                <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="deportes" element={<SportsManagement />} />
                </Route>

                <Route path="/perfil" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
                    <Route index element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes