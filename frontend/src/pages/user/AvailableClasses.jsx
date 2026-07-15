import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, InputGroup } from "react-bootstrap"
import Swal from "sweetalert2"
import { getMemberClasses, createReservation } from "../../services/reservationService"

const DAYS_OF_WEEK = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo"
}

function AvailableClasses() {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Filters
    const [selectedSport, setSelectedSport] = useState("")
    const [selectedRoom, setSelectedRoom] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadClasses()
    }, [])

    const loadClasses = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getMemberClasses()
            setClasses(data || [])
        } catch (err) {
            console.error(err)
            setError(err.message || "Error al cargar las clases disponibles")
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "No se pudieron cargar las clases disponibles",
                confirmButtonColor: "#007bff"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleReserve = async (classItem, schedule) => {
        const dayName = DAYS_OF_WEEK[schedule.day_of_week] || "Día desconocido"
        const startTime = schedule.start_time.slice(0, 5)
        const endTime = schedule.end_time.slice(0, 5)

        const result = await Swal.fire({
            title: "¿Confirmar Reserva?",
            html: `¿Deseas reservar la clase de <strong>${classItem.sport?.name}</strong>?<br/>
                   <strong>Día:</strong> ${dayName}<br/>
                   <strong>Horario:</strong> ${startTime} - ${endTime}<br/>
                   <strong>Lugar:</strong> ${classItem.room?.name}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, reservar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#007bff",
            cancelButtonColor: "#6c757d"
        })

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: "Procesando reserva...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                })

                await createReservation({ class_schedule_id: schedule.id })

                await Swal.fire({
                    icon: "success",
                    title: "¡Reserva Exitosa!",
                    text: `Has reservado la clase de ${classItem.sport?.name} correctamente.`,
                    confirmButtonColor: "#007bff"
                })

                // State update without reloading
                // Since a user can reserve, let's keep the classes listed, maybe they want to book more,
                // or just keep them as is since they can book other classes/times.
            } catch (err) {
                console.error(err)
                Swal.fire({
                    icon: "error",
                    title: "Error al reservar",
                    text: err.message || "No se pudo realizar la reserva",
                    confirmButtonColor: "#007bff"
                })
            }
        }
    }

    // Extract unique sports and rooms for filtering dropdowns
    const uniqueSports = Array.from(new Set(classes.map(c => c.sport?.id).filter(Boolean)))
        .map(id => classes.find(c => c.sport?.id === id)?.sport)
        .filter(Boolean)

    const uniqueRooms = Array.from(new Set(classes.map(c => c.room?.id).filter(Boolean)))
        .map(id => classes.find(c => c.room?.id === id)?.room)
        .filter(Boolean)

    // Filter logic
    const filteredClasses = classes.filter(classItem => {
        const matchesSport = selectedSport ? classItem.sport?.id === Number(selectedSport) : true
        const matchesRoom = selectedRoom ? classItem.room?.id === Number(selectedRoom) : true
        const matchesSearch = searchTerm
            ? classItem.sport?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              classItem.room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              classItem.coach?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            : true
        return matchesSport && matchesRoom && matchesSearch
    })

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-primary fw-bold">Clases Disponibles</h2>
                    <p className="text-muted">Explora y reserva tus clases deportivas favoritas</p>
                </div>
                <Button variant="outline-primary" onClick={loadClasses} disabled={loading} className="btn-sm px-3">
                    {loading ? <Spinner animation="border" size="sm" /> : "Actualizar"}
                </Button>
            </div>

            {/* Filters Card */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="bg-light rounded p-3">
                    <Row className="g-3 align-items-end">
                        <Col md={4}>
                            <Form.Group controlId="searchFilter">
                                <Form.Label className="fw-semibold text-secondary">Buscar</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Deporte, sala o entrenador..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} sm={6}>
                            <Form.Group controlId="sportFilter">
                                <Form.Label className="fw-semibold text-secondary">Deporte</Form.Label>
                                <Form.Select
                                    value={selectedSport}
                                    onChange={(e) => setSelectedSport(e.target.value)}
                                >
                                    <option value="">Todos los deportes</option>
                                    {uniqueSports.map(sport => (
                                        <option key={sport.id} value={sport.id}>{sport.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4} sm={6}>
                            <Form.Group controlId="roomFilter">
                                <Form.Label className="fw-semibold text-secondary">Sala</Form.Label>
                                <Form.Select
                                    value={selectedRoom}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                >
                                    <option value="">Todas las salas</option>
                                    {uniqueRooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="text-center my-5 py-5">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3 text-muted">Cargando clases...</p>
                </div>
            ) : error ? (
                <Card className="text-center border-danger my-4">
                    <Card.Body className="text-danger py-4">
                        <Card.Title>Hubo un problema</Card.Title>
                        <Card.Text>{error}</Card.Text>
                        <Button variant="danger" onClick={loadClasses}>Reintentar</Button>
                    </Card.Body>
                </Card>
            ) : filteredClasses.length === 0 ? (
                <Card className="text-center border-0 shadow-sm my-4 py-5">
                    <Card.Body>
                        <i className="bi bi-calendar-x text-muted" style={{ fontSize: "3rem" }}></i>
                        <h4 className="mt-3 text-secondary">No se encontraron clases</h4>
                        <p className="text-muted">Prueba cambiando los filtros o la búsqueda.</p>
                        {(selectedSport || selectedRoom || searchTerm) && (
                            <Button 
                                variant="primary" 
                                onClick={() => { setSelectedSport(""); setSelectedRoom(""); setSearchTerm(""); }}
                            >
                                Limpiar Filtros
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            ) : (
                <Row className="g-4">
                    {filteredClasses.map((classItem) => {
                        const activeSchedules = classItem.schedules?.filter(s => s.status) || []
                        return (
                            <Col key={classItem.id} lg={4} md={6}>
                                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                                    <div className="bg-primary text-white p-3 rounded-top d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold">{classItem.sport?.name || "Sin Deporte"}</h5>
                                        <Badge bg="light" text="primary" className="fw-semibold">
                                            {classItem.room?.name || "Sin Sala"}
                                        </Badge>
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <div className="mb-3 text-muted small">
                                            <div><strong>Entrenador:</strong> {classItem.coach?.email || "No asignado"}</div>
                                            {classItem.room?.description && (
                                                <div className="mt-1"><strong>Ubicación:</strong> {classItem.room?.description}</div>
                                            )}
                                        </div>

                                        <hr className="my-2" />

                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold text-secondary mb-2">Horarios disponibles:</h6>
                                            {activeSchedules.length === 0 ? (
                                                <p className="text-muted small italic">No hay horarios activos para esta clase.</p>
                                            ) : (
                                                <div className="d-grid gap-2">
                                                    {activeSchedules.map((schedule) => {
                                                        const dayName = DAYS_OF_WEEK[schedule.day_of_week] || "Día"
                                                        const startTime = schedule.start_time.slice(0, 5)
                                                        const endTime = schedule.end_time.slice(0, 5)
                                                        return (
                                                            <div 
                                                                key={schedule.id} 
                                                                className="d-flex justify-content-between align-items-center p-2 border rounded bg-white"
                                                            >
                                                                <span className="small fw-semibold">
                                                                    {dayName} ({startTime} - {endTime})
                                                                </span>
                                                                <Button 
                                                                    variant="primary" 
                                                                    size="sm" 
                                                                    onClick={() => handleReserve(classItem, schedule)}
                                                                    className="px-3"
                                                                >
                                                                    Reservar
                                                                </Button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            )}
        </Container>
    )
}

export default AvailableClasses
