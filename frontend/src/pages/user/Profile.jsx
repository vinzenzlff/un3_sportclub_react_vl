import React from "react"
import { Card, Badge, Container } from "react-bootstrap"
import { getUser } from "../../services/authService"

function Profile() {
    const user = getUser()

    if (!user) {
        return (
            <Container className="text-center py-5">
                <p className="text-muted">No has iniciado sesión o la sesión ha expirado.</p>
            </Container>
        )
    }

    const getRoleBadge = (role) => {
        switch (role) {
            case "admin":
                return <Badge bg="danger">Administrador</Badge>
            case "coach":
                return <Badge bg="success">Entrenador (Coach)</Badge>
            default:
                return <Badge bg="primary">Usuario (Miembro)</Badge>
        }
    }

    return (
        <Container className="py-4 d-flex justify-content-center">
            <Card style={{ maxWidth: "500px", width: "100%" }} className="shadow border-0">
                <Card.Header className="bg-dark text-white text-center py-3">
                    <h5 className="mb-0">Mi Perfil</h5>
                </Card.Header>
                <Card.Body className="p-4 text-center">
                    {/* El título principal de la tarjeta es el nombre del usuario sin correo */}
                    <Card.Title className="display-6 mb-3 text-dark fw-bold">
                        {user.full_name}
                    </Card.Title>
                    <div className="mb-4">
                        {getRoleBadge(user.role)}
                    </div>
                    <hr />
                    <div className="text-start mt-4">
                        <p className="mb-2">
                            <strong>Correo Electrónico:</strong>{" "}
                            <span className="text-muted">{user.email}</span>
                        </p>
                        <p className="mb-2">
                            <strong>Fecha de Nacimiento:</strong>{" "}
                            <span className="text-muted">
                                {user.birth_date ? user.birth_date : "No especificada"}
                            </span>
                        </p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Profile
