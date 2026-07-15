import React, { useState, useEffect } from "react"
import { Card, Col, Row, Table, Button, Spinner, Alert, Badge } from "react-bootstrap"
import { getMyClasses } from "../../services/coachService"

function MyClasses() {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchClasses = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getMyClasses()
            setClasses(data || [])
        } catch (err) {
            console.error("Error fetching coach classes:", err)
            setError(err.message || "No se pudieron cargar tus clases asignadas.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClasses()
    }, [])

    return (
        <div className="my-classes-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-success fw-bold m-0">Mis Clases</h2>
                    <p className="text-muted m-0">Visualiza los deportes y clases que tienes asignados actualmente.</p>
                </div>
                <Button 
                    variant="success" 
                    onClick={fetchClasses} 
                    disabled={loading}
                    className="d-flex align-items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" />
                            Cargando...
                        </>
                    ) : (
                        "Actualizar"
                    )}
                </Button>
            </div>

            {error && (
                <Alert variant="danger" className="shadow-sm">
                    <Alert.Heading>Error</Alert.Heading>
                    <p className="mb-0">{error}</p>
                </Alert>
            )}

            {loading ? (
                <div className="d-flex justify-content-center align-items-center my-5 py-5">
                    <Spinner animation="border" variant="success" style={{ width: "3rem", height: "3rem" }} />
                </div>
            ) : classes.length === 0 ? (
                <Card className="text-center p-5 shadow-sm border-0">
                    <Card.Body>
                        <div className="mb-3 text-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-calendar-x" viewBox="0 0 16 16">
                                <path d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/>
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </div>
                        <h4 className="fw-bold">No tienes clases asignadas</h4>
                        <p className="text-muted">
                            Actualmente no registras asignaciones de deportes activos en el sistema. 
                            Contacta al administrador para más detalles.
                        </p>
                    </Card.Body>
                </Card>
            ) : (
                <Row className="g-4">
                    {classes.map((item) => {
                        const sport = item.sport || {}
                        const room = item.room || {}
                        const isActive = sport.status !== false

                        return (
                            <Col key={item.id} xs={12} md={6} lg={4}>
                                <Card className="h-100 shadow-sm border-0 border-top border-5 border-success">
                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h5 className="card-title fw-bold text-dark mb-0">{sport.name || "Deporte Sin Nombre"}</h5>
                                            <Badge bg={isActive ? "success" : "secondary"}>
                                                {isActive ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </div>
                                        
                                        <Card.Text className="text-muted flex-grow-1" style={{ fontSize: "0.9rem" }}>
                                            <strong>Objetivo:</strong> {sport.objective || "No especificado"}
                                        </Card.Text>

                                        <hr className="my-3 text-muted opacity-25" />

                                        <div className="mt-auto">
                                            <div className="d-flex align-items-center justify-content-between mb-2" style={{ fontSize: "0.85rem" }}>
                                                <span className="text-muted">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock me-1 text-success" viewBox="0 0 16 16">
                                                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                                    </svg>
                                                    Duración:
                                                </span>
                                                <span className="fw-bold text-dark">{sport.duration ? `${sport.duration} min` : "No especificado"}</span>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between" style={{ fontSize: "0.85rem" }}>
                                                <span className="text-muted">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-1 text-success" viewBox="0 0 16 16">
                                                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                                    </svg>
                                                    Sala Asignada:
                                                </span>
                                                <span className="fw-bold text-dark">{room.name || "No asignada"}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            )}
        </div>
    )
}

export default MyClasses
