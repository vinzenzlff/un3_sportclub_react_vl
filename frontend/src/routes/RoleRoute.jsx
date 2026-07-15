import { Navigate } from "react-router-dom"
import { getUser, isAuthenticated } from "../services/authService"

function RoleRoute({ children, allowedRoles }) {
    const isAuth = isAuthenticated()
    const user = getUser()

    if (!isAuth || !user) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default RoleRoute
