import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Row, Col, Card, Spinner, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import {
    getClassSchedules,
    createClassSchedule,
    updateClassSchedule,
    deleteClassSchedule
} from "../../services/scheduleService"
import { getSportRooms, getRooms } from "../../services/roomService"
import { getSports } from "../../services/sportService"
import { getUsers } from "../../services/userService"

function SchedulesManagement() {
    const [schedules, setSchedules] = useState([])
    const [sportRooms, setSportRooms] = useState([])
    const [sports, setSports] = useState([])
    const [rooms, setRooms] = useState([])
    const [coaches, setCoaches] = useState([])
    const [loading, setLoading] = useState(true)

    // Modals visibility state
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    // Form inputs
    const [formData, setFormData] = useState({
        sport_room_id: "",
        day_of_week: "",
        start_time: "",
        end_time: ""
    })

    // Validation errors
    const [formErrors, setFormErrors] = useState({})

    // Fetch resources on mount
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Load all dependent data in parallel
            const [schedulesData, sportRoomsData, sportsData, roomsData, usersData] = await Promise.all([
                getClassSchedules(),
                getSportRooms(),
                getSports(),
                getRooms(),
                getUsers()
            ])

            setSchedules(schedulesData)
            setSportRooms(sportRoomsData)
            setSports(sportsData)
            setRooms(roomsData)
            
            // Filter users to get only coaches
            const coachesData = usersData.filter((u) => u.role === "COACH" || u.role === "coach")
            setCoaches(coachesData)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudieron cargar los datos.",
                confirmButtonColor: "#dc3545"
            })
        } finally {
            setLoading(false)
        }
    }

    // Helper functions to resolve names
    const getSportName = (sportId) => {
        const sport = sports.find((s) => s.id === Number(sportId))
        return sport ? sport.name : `Deporte #${sportId}`
    }

    const getRoomName = (roomId) => {
        const room = rooms.find((r) => r.id === Number(roomId))
        return room ? room.name : `Sala #${roomId}`
    }

    const getCoachName = (coachId) => {
        const coach = coaches.find((c) => c.id === Number(coachId))
        return coach ? coach.full_name : `Coach #${coachId}`
    }

    const getSportRoomLabel = (sportRoomId) => {
        const sr = sportRooms.find((item) => item.id === Number(sportRoomId))
        if (!sr) return `Asignación #${sportRoomId}`
        const sportName = getSportName(sr.sport_id)
        const roomName = getRoomName(sr.room_id)
        const coachName = getCoachName(sr.coach_id)
        return `${sportName} en ${roomName} (${coachName})`
    }

    const getDayOfWeekText = (dayNum) => {
        const days = {
            1: "Lunes",
            2: "Martes",
            3: "Miércoles",
            4: "Jueves",
            5: "Viernes",
            6: "Sábado",
            7: "Domingo"
        }
        return days[dayNum] || `Día ${dayNum}`
    }

    // Handle Form Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    // Validate Form Fields
    const validateForm = () => {
        const errors = {}
        if (!formData.sport_room_id) {
            errors.sport_room_id = "La asignación (Sport Room) es obligatoria."
        }
        if (!formData.day_of_week) {
            errors.day_of_week = "El día de la semana es obligatorio."
        }
        if (!formData.start_time) {
            errors.start_time = "La hora de inicio es obligatoria."
        }
        if (!formData.end_time) {
            errors.end_time = "La hora de término es obligatoria."
        } else if (formData.start_time && formData.start_time >= formData.end_time) {
            errors.end_time = "La hora de término debe ser posterior a la de inicio."
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Open Create Modal
    const handleOpenCreate = () => {
        setIsEdit(false)
        setFormData({
            sport_room_id: "",
            day_of_week: "",
            start_time: "",
            end_time: ""
        })
        setFormErrors({})
        setShowModal(true)
    }

    // Open Edit Modal
    const handleOpenEdit = (schedule) => {
        setIsEdit(true)
        setCurrentId(schedule.id)
        setFormData({
            sport_room_id: schedule.sport_room_id || "",
            day_of_week: schedule.day_of_week !== undefined ? schedule.day_of_week.toString() : "",
            start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : "",
            end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : ""
        })
        setFormErrors({})
        setShowModal(true)
    }

    // Close Modal
    const handleCloseModal = () => {
        setShowModal(false)
        setIsEdit(false)
        setCurrentId(null)
        setFormData({
            sport_room_id: "",
            day_of_week: "",
            start_time: "",
            end_time: ""
        })
        setFormErrors({})
    }

    // Submit Create or Edit Form
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            const payload = {
                sport_room_id: Number(formData.sport_room_id),
                day_of_week: Number(formData.day_of_week),
                start_time: formData.start_time,
                end_time: formData.end_time
            }

            if (isEdit) {
                const updated = await updateClassSchedule(currentId, payload)
                // Update React state immediately without reloading
                setSchedules((prev) => prev.map((s) => (s.id === currentId ? updated : s)))
                
                Swal.fire({
                    icon: "success",
                    title: "Horario Actualizado",
                    text: "El horario de la clase ha sido modificado correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            } else {
                const created = await createClassSchedule(payload)
                // Add to state immediately
                setSchedules((prev) => [...prev, created])

                Swal.fire({
                    icon: "success",
                    title: "Horario Creado",
                    text: "El horario de la clase ha sido registrado correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            handleCloseModal()
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: error.message || "Ocurrió un error al procesar el horario.",
                confirmButtonColor: "#dc3545"
            })
        }
    }

    // Delete Schedule with SWAL confirmation
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Está seguro de eliminar este horario?",
            text: "Esta acción no se puede deshacer y cancelará las reservas asociadas.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteClassSchedule(id)
                    // Update State immediately
                    setSchedules((prev) => prev.filter((s) => s.id !== id))

                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El horario ha sido eliminado correctamente.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    })
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error al eliminar",
                        text: error.message || "No se pudo eliminar el horario.",
                        confirmButtonColor: "#dc3545"
                    })
                }
            }
        })
    }

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center py-3">
                <h4 className="mb-0">Gestión de Horarios (Schedules)</h4>
                <div>
                    <Button variant="outline-light" className="me-2 fw-bold" onClick={fetchData}>
                        Refrescar
                    </Button>
                    <Button variant="light" className="text-danger fw-bold" onClick={handleOpenCreate}>
                        + Nuevo Horario
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-2 text-muted">Cargando horarios...</p>
                    </div>
                ) : (
                    <>
                        {schedules.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted mb-0">No hay horarios registrados en el sistema.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table striped hover align="middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Asignación (Sport Room)</th>
                                            <th>Día de la semana</th>
                                            <th>Hora de Inicio</th>
                                            <th>Hora de Término</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map((s) => (
                                            <tr key={s.id}>
                                                <td>{s.id}</td>
                                                <td>
                                                    <strong>{getSportRoomLabel(s.sport_room_id)}</strong>
                                                </td>
                                                <td>
                                                    <Badge bg="secondary">
                                                        {getDayOfWeekText(s.day_of_week)}
                                                    </Badge>
                                                </td>
                                                <td>{s.start_time ? s.start_time.substring(0, 5) : "-"}</td>
                                                <td>{s.end_time ? s.end_time.substring(0, 5) : "-"}</td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenEdit(s)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(s.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </>
                )}
            </Card.Body>

            {/* Create/Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size="md">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>{isEdit ? "Editar Horario" : "Nuevo Horario"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group controlId="formSportRoom">
                                    <Form.Label className="fw-semibold">Asignación (Sport Room)</Form.Label>
                                    <Form.Select
                                        name="sport_room_id"
                                        value={formData.sport_room_id}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.sport_room_id}
                                    >
                                        <option value="">Seleccione una asignación...</option>
                                        {sportRooms.map((sr) => (
                                            <option key={sr.id} value={sr.id}>
                                                {getSportRoomLabel(sr.id)}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.sport_room_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="formDay">
                                    <Form.Label className="fw-semibold">Día de la Semana</Form.Label>
                                    <Form.Select
                                        name="day_of_week"
                                        value={formData.day_of_week}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.day_of_week}
                                    >
                                        <option value="">Seleccione un día...</option>
                                        <option value="1">Lunes</option>
                                        <option value="2">Martes</option>
                                        <option value="3">Miércoles</option>
                                        <option value="4">Jueves</option>
                                        <option value="5">Viernes</option>
                                        <option value="6">Sábado</option>
                                        <option value="7">Domingo</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.day_of_week}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formStartTime">
                                    <Form.Label className="fw-semibold">Hora de Inicio</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.start_time}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.start_time}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formEndTime">
                                    <Form.Label className="fw-semibold">Hora de Término</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.end_time}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.end_time}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" type="submit">
                            {isEdit ? "Guardar Cambios" : "Programar Horario"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Card>
    )
}

export default SchedulesManagement
