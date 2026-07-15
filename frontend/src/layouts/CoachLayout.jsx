
import { Outlet } from "react-router-dom"
import AppNavbar from "../components/Navbar"

function CoachLayout() {
    return (
        <>
            <AppNavbar role="coach" bgColor="#28a745" /> {/* Verde */}
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    )
}

export default CoachLayout
