
import { Outlet } from "react-router-dom"
import AppNavbar from "../components/Navbar"
import { getUser } from "../services/authService"

function UserLayout() {
    const user = getUser()
    const role = user?.role || "user"

    // Determinar color de fondo según el rol
    let bgColor = "#007bff" // Azul por defecto para user
    if (role === "admin") {
        bgColor = "#dc3545" // Rojo para admin
    } else if (role === "coach") {
        bgColor = "#28a745" // Verde para coach
    }

    return (
        <>
            <AppNavbar role={role} bgColor={bgColor} />
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    )
}

export default UserLayout
