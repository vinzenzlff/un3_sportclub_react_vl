import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Row, Col, Card, Spinner, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import {
    getSportRooms,
    createSportRoom,
    updateSportRoom,
    deleteSportRoom,
    getRooms
} from "../../services/roomService"
import { getSports } from "../../services/sportService"
import { getUsers } from "../../services/userService"

function SportRoomsManagement() {
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
        sport_id: "",
        room_id: "",
        coach_id: ""
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
            const [sportRoomsData, sportsData, roomsData, usersData] = await Promise.all([
                getSportRooms(),
                getSports(),
                getRooms(),
                getUsers()
            ])

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
        if (!formData.sport_id) {
            errors.sport_id = "El deporte es obligatorio."
        }
        if (!formData.room_id) {
            errors.room_id = "La sala es obligatoria."
        }
        if (!formData.coach_id) {
            errors.coach_id = "El coach es obligatorio."
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Open Create Modal
    const handleOpenCreate = () => {
        setIsEdit(false)
        setFormData({
            sport_id: "",
            room_id: "",
            coach_id: ""
        })
        setFormErrors({})
        setShowModal(true)
    }

    // Open Edit Modal
    const handleOpenEdit = (sportRoom) => {
        setIsEdit(true)
        setCurrentId(sportRoom.id)
        setFormData({
            sport_id: sportRoom.sport_id || "",
            room_id: sportRoom.room_id || "",
            coach_id: sportRoom.coach_id || ""
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
            sport_id: "",
            room_id: "",
            coach_id: ""
        })
        setFormErrors({})
    }

    // Submit Create or Edit Form
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            const payload = {
                sport_id: Number(formData.sport_id),
                room_id: Number(formData.room_id),
                coach_id: Number(formData.coach_id)
            }

            if (isEdit) {
                const updated = await updateSportRoom(currentId, payload)
                // Update React state immediately without reloading
                setSportRooms((prev) => prev.map((sr) => (sr.id === currentId ? updated : sr)))
                
                Swal.fire({
                    icon: "success",
                    title: "Asignación Actualizada",
                    text: "La asignación ha sido modificada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            } else {
                const created = await createSportRoom(payload)
                // Add to state immediately
                setSportRooms((prev) => [...prev, created])

                Swal.fire({
                    icon: "success",
                    title: "Asignación Creada",
                    text: "La asignación ha sido registrada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            handleCloseModal()
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: error.message || "Ocurrió un error al procesar la asignación.",
                confirmButtonColor: "#dc3545"
            })
        }
    }

    // Delete Assignment with SWAL confirmation
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Está seguro de eliminar esta asignación?",
            text: `Esta acción no se puede deshacer y podría afectar a los horarios asociados.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteSportRoom(id)
                    // Update State immediately
                    setSportRooms((prev) => prev.filter((sr) => sr.id !== id))

                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "La asignación ha sido eliminada correctamente.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    })
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error al eliminar",
                        text: error.message || "No se pudo eliminar la asignación.",
                        confirmButtonColor: "#dc3545"
                    })
                }
            }
        })
    }

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center py-3">
                <h4 className="mb-0">Gestión de Asignaciones (Sport Rooms)</h4>
                <div>
                    <Button variant="outline-light" className="me-2 fw-bold" onClick={fetchData}>
                        Refrescar
                    </Button>
                    <Button variant="light" className="text-danger fw-bold" onClick={handleOpenCreate}>
                        + Nueva Asignación
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-2 text-muted">Cargando asignaciones...</p>
                    </div>
                ) : (
                    <>
                        {sportRooms.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted mb-0">No hay asignaciones registradas en el sistema.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table striped hover align="middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Deporte</th>
                                            <th>Sala</th>
                                            <th>Coach</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sportRooms.map((sr) => (
                                            <tr key={sr.id}>
                                                <td>{sr.id}</td>
                                                <td>
                                                    <strong>{getSportName(sr.sport_id)}</strong>
                                                </td>
                                                <td>
                                                    <Badge bg="info" className="text-dark">
                                                        {getRoomName(sr.room_id)}
                                                    </Badge>
                                                </td>
                                                <td>{getCoachName(sr.coach_id)}</td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenEdit(sr)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(sr.id)}
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
                    <Modal.Title>{isEdit ? "Editar Asignación" : "Nueva Asignación"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group controlId="formSport">
                                    <Form.Label className="fw-semibold">Deporte</Form.Label>
                                    <Form.Select
                                        name="sport_id"
                                        value={formData.sport_id}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.sport_id}
                                    >
                                        <option value="">Seleccione un deporte...</option>
                                        {sports.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.sport_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="formRoom">
                                    <Form.Label className="fw-semibold">Sala</Form.Label>
                                    <Form.Select
                                        name="room_id"
                                        value={formData.room_id}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.room_id}
                                    >
                                        <option value="">Seleccione una sala...</option>
                                        {rooms.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.room_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="formCoach">
                                    <Form.Label className="fw-semibold">Coach</Form.Label>
                                    <Form.Select
                                        name="coach_id"
                                        value={formData.coach_id}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.coach_id}
                                    >
                                        <option value="">Seleccione un coach...</option>
                                        {coaches.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.full_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.coach_id}
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
                            {isEdit ? "Guardar Cambios" : "Asignar"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Card>
    )
}

export default SportRoomsManagement
