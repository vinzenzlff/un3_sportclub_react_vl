import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMyReservations, cancelReservation } from "../../services/reservationService"

const DAYS_OF_WEEK = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo"
}

function MyReservations() {
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState("all") // 'all', 'active', 'cancelled'

    useEffect(() => {
        loadReservations()
    }, [])

    const loadReservations = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getMyReservations()
            setReservations(data || [])
        } catch (err) {
            console.error(err)
            setError(err.message || "Error al cargar tus reservas")
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "No se pudieron cargar tus reservas",
                confirmButtonColor: "#007bff"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (reservation) => {
        const classSchedule = reservation.classSchedule
        const sportRoom = classSchedule?.sportRoom
        const sportName = sportRoom?.sport?.name || "Clase"
        const dayName = DAYS_OF_WEEK[classSchedule?.day_of_week] || "Día"
        const timeStr = classSchedule ? `${classSchedule.start_time.slice(0, 5)} - ${classSchedule.end_time.slice(0, 5)}` : ""

        const result = await Swal.fire({
            title: "¿Cancelar Reserva?",
            html: `¿Estás seguro de que deseas cancelar tu reserva para:<br/>
                   <strong>${sportName}</strong> el día <strong>${dayName}</strong> en el horario <strong>${timeStr}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar reserva",
            cancelButtonText: "Volver",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d"
        })

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: "Cancelando reserva...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                await cancelReservation(reservation.id)

                await Swal.fire({
                    icon: "success",
                    title: "¡Reserva Cancelada!",
                    text: "Tu reserva ha sido cancelada exitosamente.",
                    confirmButtonColor: "#007bff"
                })

                // State update without reloading
                setReservations(prev => 
                    prev.map(res => 
                        res.id === reservation.id 
                            ? { ...res, status: "cancelled" } 
                            : res
                    )
                )
            } catch (err) {
                console.error(err)
                Swal.fire({
                    icon: "error",
                    title: "Error al cancelar",
                    text: err.message || "No se pudo cancelar la reserva",
                    confirmButtonColor: "#007bff"
                })
            }
        }
    }

    const filteredReservations = reservations.filter(res => {
        if (statusFilter === "all") return true
        return res.status === statusFilter
    })

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-primary fw-bold">Mis Reservas</h2>
                    <p className="text-muted">Administra tus reservas de clases y actividades programadas</p>
                </div>
                <Button variant="outline-primary" onClick={loadReservations} disabled={loading} className="btn-sm px-3">
                    {loading ? <Spinner animation="border" size="sm" /> : "Actualizar"}
                </Button>
            </div>

            {/* Filter controls */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="bg-light rounded p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center">
                        <span className="me-2 fw-semibold text-secondary">Filtrar por Estado:</span>
                        <Form.Select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ width: "200px" }}
                        >
                            <option value="all">Todas las reservas</option>
                            <option value="active">Activas</option>
                            <option value="cancelled">Canceladas</option>
                        </Form.Select>
                    </div>
                    <div className="text-muted small">
                        Total encontradas: <strong>{filteredReservations.length}</strong>
                    </div>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center my-5 py-5">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3 text-muted">Cargando tus reservas...</p>
                </div>
            ) : error ? (
                <Card className="text-center border-danger my-4">
                    <Card.Body className="text-danger py-4">
                        <Card.Title>Hubo un problema</Card.Title>
                        <Card.Text>{error}</Card.Text>
                        <Button variant="danger" onClick={loadReservations}>Reintentar</Button>
                    </Card.Body>
                </Card>
            ) : filteredReservations.length === 0 ? (
                <Card className="text-center border-0 shadow-sm my-4 py-5">
                    <Card.Body>
                        <i className="bi bi-calendar-event text-muted" style={{ fontSize: "3rem" }}></i>
                        <h4 className="mt-3 text-secondary">No tienes reservas registradas</h4>
                        <p className="text-muted">Parece que aún no tienes reservas en esta sección.</p>
                    </Card.Body>
                </Card>
            ) : (
                <div className="table-responsive bg-white rounded shadow-sm">
                    <Table hover align="middle" className="mb-0">
                        <thead className="table-primary text-white">
                            <tr>
                                <th className="ps-3">ID Reserva</th>
                                <th>Clase / Deporte</th>
                                <th>Sala / Ubicación</th>
                                <th>Entrenador</th>
                                <th>Día y Horario</th>
                                <th>Estado</th>
                                <th className="text-end pe-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((reservation) => {
                                const classSchedule = reservation.classSchedule
                                const sportRoom = classSchedule?.sportRoom
                                const sportName = sportRoom?.sport?.name || "Sin Deporte"
                                const roomName = sportRoom?.room?.name || "Sin Sala"
                                const coachEmail = sportRoom?.coach?.email || "Sin Entrenador"
                                const dayName = classSchedule ? (DAYS_OF_WEEK[classSchedule.day_of_week] || "Día") : "No definido"
                                const timeStr = classSchedule ? `${classSchedule.start_time.slice(0, 5)} - ${classSchedule.end_time.slice(0, 5)}` : "No definido"

                                return (
                                    <tr key={reservation.id}>
                                        <td className="ps-3 fw-bold">#{reservation.id}</td>
                                        <td>
                                            <span className="fw-semibold text-primary">{sportName}</span>
                                        </td>
                                        <td>{roomName}</td>
                                        <td className="text-muted small">{coachEmail}</td>
                                        <td>
                                            <span className="fw-semibold">{dayName}</span>
                                            <div className="small text-muted">{timeStr}</div>
                                        </td>
                                        <td>
                                            {reservation.status === "active" ? (
                                                <Badge bg="success">Activa</Badge>
                                            ) : (
                                                <Badge bg="secondary">Cancelada</Badge>
                                            )}
                                        </td>
                                        <td className="text-end pe-3">
                                            {reservation.status === "active" ? (
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleCancel(reservation)}
                                                >
                                                    Cancelar
                                                </Button>
                                            ) : (
                                                <span className="text-muted small">No aplicable</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    )
}

export default MyReservations
