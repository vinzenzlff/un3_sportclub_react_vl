import React, { useState, useEffect } from "react"
import { Card, Col, Row, Table, Button, Spinner, Alert, Badge } from "react-bootstrap"
import { getMySchedules, getMyRooms } from "../../services/coachService"

function MySchedule() {
    const [schedules, setSchedules] = useState([])
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            const [schedulesData, roomsData] = await Promise.all([
                getMySchedules(),
                getMyRooms()
            ])
            setSchedules(schedulesData || [])
            setRooms(roomsData || [])
        } catch (err) {
            console.error("Error fetching coach schedule details:", err)
            setError(err.message || "No se pudo cargar la información del horario.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getDayName = (dayNumber) => {
        const days = {
            1: "Lunes",
            2: "Martes",
            3: "Miércoles",
            4: "Jueves",
            5: "Viernes",
            6: "Sábado",
            7: "Domingo"
        }
        return days[dayNumber] || `Día ${dayNumber}`
    }

    const formatTime = (timeString) => {
        if (!timeString) return ""
        // Formatea "18:00:00" a "18:00"
        const parts = timeString.split(":")
        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`
        }
        return timeString
    }

    return (
        <div className="my-schedule-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-success fw-bold m-0">Mi Horario</h2>
                    <p className="text-muted m-0">Consulta tu agenda semanal y las salas asignadas para tus clases.</p>
                </div>
                <Button 
                    variant="success" 
                    onClick={fetchData} 
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
            ) : (
                <Row className="g-4">
                    {/* Sección Principal de Horario Semanal */}
                    <Col lg={8}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-success text-white py-3 border-0">
                                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                    Cronograma de Clases
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {schedules.length === 0 ? (
                                    <div className="text-center p-5 text-muted">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-clock-history mb-3 opacity-50" viewBox="0 0 16 16">
                                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.41 1.452c-.045-.183-.1-.36-.169-.533l.936-.35c.101.27.185.549.25.834l-.97.234a6.972 6.972 0 0 0-.047-.185zM16 8A8 8 0 1 1 8 0a8 8 0 0 1 8 8z"/>
                                            <path d="M8.5 4.466V8.5h4v1h-5V4.466h1z"/>
                                        </svg>
                                        <p className="mb-0">No registras horarios de clases programados en el sistema.</p>
                                    </div>
                                ) : (
                                    <Table responsive hover striped className="align-middle m-0 text-nowrap">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary" style={{ fontSize: "0.85rem" }}>DÍA</th>
                                                <th className="py-3 text-secondary" style={{ fontSize: "0.85rem" }}>HORARIO</th>
                                                <th className="py-3 text-secondary" style={{ fontSize: "0.85rem" }}>DEPORTE</th>
                                                <th className="px-4 py-3 text-secondary text-end" style={{ fontSize: "0.85rem" }}>SALA / UBICACIÓN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.map((schedule) => {
                                                const sportRoom = schedule.sportRoom || {}
                                                const sport = sportRoom.sport || {}
                                                const room = sportRoom.room || {}

                                                return (
                                                    <tr key={schedule.id}>
                                                        <td className="px-4 py-3 fw-bold text-success">
                                                            {getDayName(schedule.day_of_week)}
                                                        </td>
                                                        <td className="py-3">
                                                            <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 py-2 px-3 fw-semibold">
                                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="fw-semibold text-dark">{sport.name || "Deporte"}</div>
                                                            <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                                                                Duración: {sport.duration ? `${sport.duration} min` : "N/D"}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-end">
                                                            <div className="fw-semibold text-dark">{room.name || "No asignada"}</div>
                                                            <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                                                                {room.location || "Sin ubicación"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Sección Lateral de Salas de Entrenamiento Asignadas */}
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 border-top border-5 border-success h-100">
                            <Card.Body>
                                <h5 className="text-success fw-bold mb-3 d-flex align-items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
                                        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
                                    </svg>
                                    Mis Salas de Clase
                                </h5>
                                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                                    Estas son las salas donde dictas clases. Cada sala cuenta con aforo y equipamiento específico.
                                </p>
                                <hr className="my-3 text-muted opacity-25" />

                                {rooms.length === 0 ? (
                                    <div className="text-center py-4 text-muted" style={{ fontSize: "0.9rem" }}>
                                        No registras salas asignadas actualmente.
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {rooms.map((roomItem) => {
                                            const sName = roomItem.sport?.name || ""
                                            return (
                                                <Card key={roomItem.id} className="bg-light border-0 shadow-none p-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="fw-bold text-dark">{roomItem.name}</span>
                                                        <Badge bg="success" style={{ fontSize: "0.75rem" }}>
                                                            Aforo: {roomItem.capacity}
                                                        </Badge>
                                                    </div>
                                                    {sName && (
                                                        <div className="text-success mb-2" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                                                            Deporte: {sName}
                                                        </div>
                                                    )}
                                                    <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                                                        <strong>Ubicación:</strong> {roomItem.location || "Sin dirección"}
                                                    </div>
                                                    {roomItem.observation && (
                                                        <div className="text-muted mt-1" style={{ fontSize: "0.8rem" }}>
                                                            <strong>Obs:</strong> {roomItem.observation}
                                                        </div>
                                                    )}
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default MySchedule
