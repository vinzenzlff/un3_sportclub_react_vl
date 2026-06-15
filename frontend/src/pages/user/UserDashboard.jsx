
import React from "react"
import { Card, Col, Row } from "react-bootstrap"
import { getUser } from "../../services/authService"

function UserDashboard() {
    const user = getUser()
    const userName = user ? user.full_name : "Usuario"

    return (
        <Row>
            <Col md={12}>
                <Card bg="primary" text="white" className="mb-4">
                    <Card.Body>
                        <Card.Title>Bienvenido, {userName}</Card.Title>
                        <Card.Text>Aquí puedes gestionar tus reservas y ver tu información personal.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6}>
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>Próximas Clases</Card.Title>
                        <Card.Text>No tienes clases programadas para esta semana.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6}>
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>Historial de Actividad</Card.Title>
                        <Card.Text>Última vez que iniciaste sesión: 10/11/2026</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default UserDashboard
