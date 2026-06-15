
import React from "react"
import { Card, Col, Row, Table, Button } from "react-bootstrap"
import { getUser } from "../../services/authService"

function CoachDashboard() {
    const user = getUser()
    const coachName = user ? user.full_name : "Coach / Entrenador"

    return (
        <Row>
            <Col md={12}>
                <Card bg="success" text="white" className="mb-4">
                    <Card.Body>
                        <Card.Title>Bienvenido, {coachName}</Card.Title>
                        <Card.Text>Aquí puedes ver tus clases programadas, alumnos inscritos y gestionar tus horarios.</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={12}>
                <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-success text-white">Mis Clases Asignadas</Card.Header>
                    <Card.Body>
                        <Table responsive hover striped className="align-middle">
                            <thead>
                                <tr>
                                    <th>Clase</th>
                                    <th>Horario</th>
                                    <th>Alumnos Inscritos</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Funcional Fit</td>
                                    <td>Lunes y Miércoles 08:00 - 09:30</td>
                                    <td>12 Alumnos</td>
                                    <td><span className="badge bg-success">Activo</span></td>
                                    <td>
                                        <Button variant="outline-success" size="sm">Ver Alumnos</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Spinning Pro</td>
                                    <td>Martes y Jueves 19:00 - 20:00</td>
                                    <td>8 Alumnos</td>
                                    <td><span className="badge bg-success">Activo</span></td>
                                    <td>
                                        <Button variant="outline-success" size="sm">Ver Alumnos</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Power Yoga</td>
                                    <td>Viernes 10:00 - 11:30</td>
                                    <td>15 Alumnos</td>
                                    <td><span className="badge bg-secondary">Pausado</span></td>
                                    <td>
                                        <Button variant="outline-success" size="sm">Ver Alumnos</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default CoachDashboard
