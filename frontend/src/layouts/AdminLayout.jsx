
import { Outlet } from "react-router-dom"
import AppNavbar from "../components/Navbar"

function AdminLayout() {
    return (
        <>
            <AppNavbar role="admin" bgColor="#dc3545" /> {/* Rojo */}
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    )
}

export default AdminLayout
