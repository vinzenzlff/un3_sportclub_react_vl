
import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { logout, getUser } from "../services/authService"
import sportclubLogo from "../assets/sportclub.png"

function AppNavbar({ role, bgColor }) {
    const navigate = useNavigate()
    const location = useLocation()
    const user = getUser()

    const isProfile = location.pathname === "/perfil"

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <Navbar expand="lg" variant="dark" style={{ backgroundColor: bgColor }}>
            <Container>
                <Navbar.Brand as={Link} to={role ? `/${role}/dashboard` : "/"}>
                    <img
                        src={sportclubLogo}
                        width="auto"
                        height="40"
                        style={{ objectFit: 'contain' }}
                        className="d-inline-block align-top"
                        alt="SportClub Logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {role === "admin" && (
                            <>
                                <Nav.Link as={Link} to="/admin/dashboard">Gestión de Usuarios</Nav.Link>
                                <Nav.Link as={Link} to="/admin/deportes">Gestión de Deportes</Nav.Link>
                            </>
                        )}
                        {isProfile && role === "coach" && (
                            <Nav.Link as={Link} to="/coach/dashboard">Mis Clases</Nav.Link>
                        )}
                        {isProfile && role === "user" && (
                            <Nav.Link as={Link} to="/user/dashboard">Mis Reservas</Nav.Link>
                        )}
                    </Nav>
                    <Nav className="align-items-center">
                        {user && <Nav.Link as={Link} to="/perfil">Mi Perfil</Nav.Link>}
                        <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
