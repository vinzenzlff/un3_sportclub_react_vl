
import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { logout, getUser } from "../services/authService"
import sportclubLogo from "../assets/sportclub.png"

function AppNavbar({ role, bgColor }) {
    const navigate = useNavigate()
    const user = getUser()

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
                                <Nav.Link as={NavLink} to="/admin/dashboard">Gestión de Usuarios</Nav.Link>
                                <Nav.Link as={NavLink} to="/admin/deportes">Gestión de Deportes</Nav.Link>
                                <Nav.Link as={NavLink} to="/admin/salas">Gestión de Salas</Nav.Link>
                                <Nav.Link as={NavLink} to="/admin/asignaciones">Gestión de Asignaciones</Nav.Link>
                                <Nav.Link as={NavLink} to="/admin/horarios">Gestión de Horarios</Nav.Link>
                            </>
                        )}
                        {role === "coach" && (
                            <>
                                <Nav.Link as={NavLink} to="/coach/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={NavLink} to="/coach/clases">Mis Clases</Nav.Link>
                                <Nav.Link as={NavLink} to="/coach/horario">Mi Horario</Nav.Link>
                            </>
                        )}
                        {role === "user" && (
                            <>
                                <Nav.Link as={NavLink} to="/user/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={NavLink} to="/user/clases">Clases Disponibles</Nav.Link>
                                <Nav.Link as={NavLink} to="/user/reservas">Mis Reservas</Nav.Link>
                            </>
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
