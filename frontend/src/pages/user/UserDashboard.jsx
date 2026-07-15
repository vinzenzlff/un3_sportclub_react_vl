import React from "react"
import { Card, Col, Row, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../services/authService"

function UserDashboard() {
    const navigate = useNavigate()
    const user = getUser()
    const userName = user ? user.full_name : "Usuario"

    return (
        <Row className="g-4">
            <Col md={12}>
                <Card bg="primary" text="white" className="shadow-sm border-0">
                    <Card.Body>
                        <Card.Title className="fw-bold">Bienvenido, {userName}</Card.Title>
                        <Card.Text className="mb-0">
                            Tu espacio para descubrir clases y gestionar tus reservas de forma rápida.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={12}>
                <Card className="shadow-sm border-0 h-100">
                    <Card.Body>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                            <div>
                                <Card.Title className="text-primary">Inicio rápido</Card.Title>
                                <Card.Text className="text-muted mb-0">
                                    Accede a las experiencias más comunes del portal.
                                </Card.Text>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <Button variant="primary" onClick={() => navigate("/user/clases")}>
                                    Explorar Clases Disponibles
                                </Button>
                                <Button variant="outline-primary" onClick={() => navigate("/user/reservas")}>
                                    Ver Mis Reservas
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default UserDashboard
