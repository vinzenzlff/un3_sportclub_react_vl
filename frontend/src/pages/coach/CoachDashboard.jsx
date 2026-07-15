import React from "react"
import { Card, Col, Row, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../services/authService"

function CoachDashboard() {
    const navigate = useNavigate()
    const user = getUser()
    const coachName = user ? user.full_name : "Coach / Entrenador"

    return (
        <Row className="g-4">
            <Col md={12}>
                <Card bg="success" text="white" className="shadow-sm border-0">
                    <Card.Body>
                        <Card.Title className="fw-bold">Bienvenido, {coachName}</Card.Title>
                        <Card.Text className="mb-0">
                            Gestiona tus clases y tu horario desde un panel más claro y enfocado en lo operativo.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={12}>
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                            <div>
                                <Card.Title className="text-success mb-2">Panel de control</Card.Title>
                                <Card.Text className="text-muted mb-0">
                                    Accede rápidamente a tus clases asignadas y a la vista de horarios.
                                </Card.Text>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <Button variant="success" onClick={() => navigate("/coach/clases")}>
                                    Ir a Mis Clases
                                </Button>
                                <Button variant="outline-success" onClick={() => navigate("/coach/horario")}>
                                    Revisar Mi Horario
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default CoachDashboard
