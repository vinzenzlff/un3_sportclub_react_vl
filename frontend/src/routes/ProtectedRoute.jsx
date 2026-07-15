import { Navigate } from "react-router-dom"
import { isAuthenticated, getUser } from "../services/authService"

function ProtectedRoute({ children }) {
    const isAuth = isAuthenticated()
    const user = getUser()

    if (!isAuth || !user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
