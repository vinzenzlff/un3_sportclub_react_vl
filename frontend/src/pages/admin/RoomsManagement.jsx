import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Row, Col, Card, Spinner, Badge } from "react-bootstrap"
import Swal from "sweetalert2"
import {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
} from "../../services/roomService"

function RoomsManagement() {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    // Modals visibility state
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [currentRoomId, setCurrentRoomId] = useState(null)

    // Form inputs
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        capacity: 10,
        location: "",
        observation: "",
        image_url: "",
        status: true
    })

    // Validation errors
    const [formErrors, setFormErrors] = useState({})

    // Fetch rooms on mount
    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        setLoading(true)
        try {
            const data = await getRooms()
            setRooms(data)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudieron cargar las salas.",
                confirmButtonColor: "#dc3545"
            })
        } finally {
            setLoading(false)
        }
    }

    // Handle Form Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === "capacity") {
            let val = value.replace(/\D/g, "") // strictly digits
            if (val !== "") {
                val = Number(val).toString()
            }
            setFormData((prev) => ({
                ...prev,
                capacity: val === "" ? "" : Number(val)
            }))
            if (formErrors.capacity) {
                setFormErrors((prev) => ({ ...prev, capacity: null }))
            }
            return
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))

        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    // Validate Form Fields
    const validateForm = () => {
        const errors = {}
        if (!formData.name || !formData.name.trim()) {
            errors.name = "El nombre de la sala es obligatorio."
        }
        if (formData.capacity === undefined || formData.capacity === null || formData.capacity === "" || formData.capacity <= 0) {
            errors.capacity = "La capacidad debe ser un número mayor a 0."
        }
        if (!formData.location || !formData.location.trim()) {
            errors.location = "La ubicación de la sala es obligatoria."
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Open Create Modal
    const handleOpenCreate = () => {
        setIsEdit(false)
        setFormData({
            name: "",
            description: "",
            capacity: 10,
            location: "",
            observation: "",
            image_url: "",
            status: true
        })
        setFormErrors({})
        setShowModal(true)
    }

    // Open Edit Modal
    const handleOpenEdit = (room) => {
        setIsEdit(true)
        setCurrentRoomId(room.id)
        setFormData({
            name: room.name || "",
            description: room.description || "",
            capacity: room.capacity || 10,
            location: room.location || "",
            observation: room.observation || "",
            image_url: room.image_url || "",
            status: room.status !== undefined ? room.status : true
        })
        setFormErrors({})
        setShowModal(true)
    }

    // Close Modal
    const handleCloseModal = () => {
        setShowModal(false)
        setIsEdit(false)
        setCurrentRoomId(null)
        setFormData({
            name: "",
            description: "",
            capacity: 10,
            location: "",
            observation: "",
            image_url: "",
            status: true
        })
        setFormErrors({})
    }

    // Submit Create or Edit Form
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            // Make sure status is sent correctly
            const payload = {
                ...formData,
                capacity: Number(formData.capacity)
            }

            if (isEdit) {
                const updated = await updateRoom(currentRoomId, payload)
                // Update React state immediately without reloading
                setRooms((prev) => prev.map((r) => (r.id === currentRoomId ? updated : r)))
                
                Swal.fire({
                    icon: "success",
                    title: "Sala Actualizada",
                    text: "La sala ha sido modificada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            } else {
                const created = await createRoom(payload)
                // Add to state immediately
                setRooms((prev) => [...prev, created])

                Swal.fire({
                    icon: "success",
                    title: "Sala Creada",
                    text: "La sala ha sido registrada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            handleCloseModal()
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: error.message || "Ocurrió un error al procesar la sala.",
                confirmButtonColor: "#dc3545"
            })
        }
    }

    // Delete Room with SWAL confirmation
    const handleDelete = (id, name) => {
        Swal.fire({
            title: "¿Está seguro de eliminar esta sala?",
            text: `Vas a eliminar "${name}". Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteRoom(id)
                    // Update State immediately
                    setRooms((prev) => prev.filter((r) => r.id !== id))

                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "La sala ha sido eliminada correctamente.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    })
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error al eliminar",
                        text: error.message || "No se pudo eliminar la sala.",
                        confirmButtonColor: "#dc3545"
                    })
                }
            }
        })
    }

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center py-3">
                <h4 className="mb-0">Gestión de Salas</h4>
                <div>
                    <Button variant="outline-light" className="me-2 fw-bold" onClick={fetchRooms}>
                        Refrescar
                    </Button>
                    <Button variant="light" className="text-danger fw-bold" onClick={handleOpenCreate}>
                        + Nueva Sala
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-2 text-muted">Cargando salas...</p>
                    </div>
                ) : (
                    <>
                        {rooms.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted mb-0">No hay salas registradas en el sistema.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table striped hover align="middle">
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Capacidad</th>
                                            <th>Ubicación</th>
                                            <th>Observación</th>
                                            <th>Estado</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map((room) => (
                                            <tr key={room.id}>
                                                <td>
                                                    {room.image_url ? (
                                                        <img
                                                            src={room.image_url}
                                                            alt={room.name}
                                                            style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px" }}
                                                            onError={(e) => {
                                                                e.target.onerror = null
                                                                e.target.src = "https://placehold.co/60x45?text=No+Img"
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-muted small">Sin imagen</span>
                                                    )}
                                                </td>
                                                <td>{room.id}</td>
                                                <td><strong>{room.name}</strong></td>
                                                <td>{room.description || "-"}</td>
                                                <td><Badge bg="info" className="text-dark">{room.capacity} pers.</Badge></td>
                                                <td>{room.location}</td>
                                                <td>{room.observation || "-"}</td>
                                                <td>
                                                    <Badge bg={room.status ? "success" : "secondary"}>
                                                        {room.status ? "Activa" : "Inactiva"}
                                                    </Badge>
                                                </td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenEdit(room)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(room.id, room.name)}
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
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>{isEdit ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Label className="fw-semibold">Nombre de la Sala</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Ej. Sala de Spinning, Piscina..."
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formCapacity">
                                    <Form.Label className="fw-semibold">Capacidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        inputMode="numeric"
                                        name="capacity"
                                        placeholder="10"
                                        min={1}
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.capacity}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.capacity}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="formDescription">
                                    <Form.Label className="fw-semibold">Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="description"
                                        placeholder="Breve descripción de las características de la sala."
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formLocation">
                                    <Form.Label className="fw-semibold">Ubicación</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        placeholder="Ej. Piso 2, Sector B"
                                        value={formData.location}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.location}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.location}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formImageUrl">
                                    <Form.Label className="fw-semibold">URL de Imagen</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="image_url"
                                        placeholder="https://ejemplo.com/sala.jpg"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="formObservation">
                                    <Form.Label className="fw-semibold">Observación</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="observation"
                                        placeholder="Ej. Aire acondicionado en mantención, etc."
                                        value={formData.observation}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formStatus" className="mt-2">
                                    <Form.Check
                                        type="checkbox"
                                        name="status"
                                        label="Sala Activa"
                                        checked={formData.status}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" type="submit">
                            {isEdit ? "Guardar Cambios" : "Registrar Sala"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Card>
    )
}

export default RoomsManagement