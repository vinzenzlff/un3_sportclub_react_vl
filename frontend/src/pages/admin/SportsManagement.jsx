import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Row, Col, Card, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import {
    getSports,
    createSport,
    updateSport,
    deleteSport,
    updateSportStatus
} from "../../services/sportService"

function SportsManagement() {
    const [sports, setSports] = useState([])
    const [loading, setLoading] = useState(true)

    // Modals visibility state
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [currentSportId, setCurrentSportId] = useState(null)

    // Form inputs
    const [formData, setFormData] = useState({
        name: "",
        objective: "",
        duration: 60,
        status: true
    })

    // Validation errors
    const [formErrors, setFormErrors] = useState({})

    // Fetch sports on mount
    useEffect(() => {
        fetchSports()
    }, [])

    const fetchSports = async () => {
        setLoading(true)
        try {
            const data = await getSports()
            setSports(data)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudieron cargar los deportes.",
                confirmButtonColor: "#dc3545"
            })
        } finally {
            setLoading(false)
        }
    };

    // Format Date Strictly: '15 de Julio de 2026'
    const formatDate = (dateString) => {
        if (!dateString) return "-"
        try {
            const date = new Date(dateString)
            // Using UTC to avoid timezone offset issues (like showing the previous day in Chile timezone)
            const formatter = new Intl.DateTimeFormat('es-CL', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            })
            const parts = formatter.formatToParts(date)
            let day = ""
            let month = ""
            let year = ""

            for (const part of parts) {
                if (part.type === 'day') day = part.value
                if (part.type === 'month') {
                    month = part.value.charAt(0).toUpperCase() + part.value.slice(1)
                }
                if (part.type === 'year') year = part.value
            }
            return `${day} de ${month} de ${year}`
        } catch (error) {
            return dateString
        }
    }

    // Handle Form Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === "duration") {
            let val = value.replace(/\D/g, "") // strictly digits
            if (val.length > 3) {
                val = val.slice(0, 3)
            }
            if (val !== "") {
                val = Number(val).toString() // remove leading zeros (e.g., '015' -> '15')
            }
            setFormData((prev) => ({
                ...prev,
                duration: val === "" ? "" : Number(val)
            }))
            if (formErrors.duration) {
                setFormErrors((prev) => ({ ...prev, duration: null }))
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
            errors.name = "El nombre del deporte es obligatorio."
        }
        if (!formData.objective || !formData.objective.trim()) {
            errors.objective = "El objetivo del deporte es obligatorio."
        }
        if (formData.duration === undefined || formData.duration === null || formData.duration === "" || formData.duration < 1 || formData.duration > 480) {
            errors.duration = "La duración debe ser un número entero válido entre 1 y 480 minutos."
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Open Create Modal
    const handleOpenCreate = () => {
        setIsEdit(false)
        setFormData({
            name: "",
            objective: "",
            duration: 60,
            status: true
        })
        setFormErrors({})
        setShowModal(true)
    }

    // Open Edit Modal
    const handleOpenEdit = (sport) => {
        setIsEdit(true)
        setCurrentSportId(sport.id)
        setFormData({
            name: sport.name || "",
            objective: sport.objective || "",
            duration: sport.duration || 60,
            status: sport.status !== undefined ? sport.status : true
        })
        setFormErrors({})
        setShowModal(true)
    }

    // Close Modal
    const handleCloseModal = () => {
        setShowModal(false)
        setIsEdit(false)
        setCurrentSportId(null)
        setFormData({
            name: "",
            objective: "",
            duration: 60,
            status: true
        })
        setFormErrors({})
    }

    // Submit Create or Edit Form
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            if (isEdit) {
                const updated = await updateSport(currentSportId, formData)
                // Update React state immediately without reloading
                setSports((prev) => prev.map((s) => (s.id === currentSportId ? updated : s)))
                
                Swal.fire({
                    icon: "success",
                    title: "Deporte Actualizado",
                    text: "El deporte ha sido modificado correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            } else {
                const created = await createSport(formData)
                // Add to state immediately
                setSports((prev) => [...prev, created])

                Swal.fire({
                    icon: "success",
                    title: "Deporte Creado",
                    text: "El deporte ha sido registrado correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            handleCloseModal()
        } catch (error) {
            const isValidationError = error.message && (
                error.message.includes("inválido") ||
                error.message.includes("invalido") ||
                error.message.includes("Validation") ||
                error.message.includes("obligatorio") ||
                error.message.includes("400")
            )

            if (isValidationError) {
                Swal.fire({
                    icon: "warning",
                    title: "Datos Inválidos",
                    text: "Datos inválidos. Por favor verifica que el nombre no esté vacío, el objetivo sea claro y la duración sea un número válido entre 1 y 480 minutos.",
                    confirmButtonColor: "#dc3545"
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al guardar",
                    text: error.message || "Ocurrió un error al procesar el deporte.",
                    confirmButtonColor: "#dc3545"
                })
            }
        }
    }

    // Handle Switch (Change Status directly)
    const handleStatusChange = async (id, newStatus) => {
        try {
            // Update UI optimistically or directly
            const updated = await updateSportStatus(id, newStatus)
            setSports((prev) => prev.map((s) => (s.id === id ? updated : s)))
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al cambiar estado",
                text: error.message || "No se pudo actualizar el estado del deporte.",
                confirmButtonColor: "#dc3545"
            })
        }
    }

    // Delete Sport with SWAL confirmation
    const handleDelete = (id, name) => {
        Swal.fire({
            title: "¿Está seguro de eliminar este deporte?",
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
                    await deleteSport(id)
                    // Update State immediately
                    setSports((prev) => prev.filter((s) => s.id !== id))

                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El deporte ha sido eliminado correctamente.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    })
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error al eliminar",
                        text: error.message || "No se pudo eliminar el deporte.",
                        confirmButtonColor: "#dc3545"
                    })
                }
            }
        })
    }

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center py-3">
                <h4 className="mb-0">Gestión de Deportes</h4>
                <div>
                    <Button variant="outline-light" className="me-2 fw-bold" onClick={fetchSports}>
                        Refrescar
                    </Button>
                    <Button variant="light" className="text-danger fw-bold" onClick={handleOpenCreate}>
                        + Nuevo Deporte
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-2 text-muted">Cargando deportes...</p>
                    </div>
                ) : (
                    <>
                        {sports.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted mb-0">No hay deportes registrados en el sistema.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table striped hover align="middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Objetivo</th>
                                            <th>Duración (min)</th>
                                            <th>Estado</th>
                                            <th>Fecha de Creación</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sports.map((sport) => (
                                            <tr key={sport.id}>
                                                <td>{sport.id}</td>
                                                <td><strong>{sport.name}</strong></td>
                                                <td>{sport.objective}</td>
                                                <td>{sport.duration} min</td>
                                                <td>
                                                    <Form.Check
                                                        type="switch"
                                                        id={`status-switch-${sport.id}`}
                                                        checked={sport.status}
                                                        onChange={(e) => handleStatusChange(sport.id, e.target.checked)}
                                                        label={sport.status ? "Activo" : "Inactivo"}
                                                    />
                                                </td>
                                                <td>{formatDate(sport.created_at)}</td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenEdit(sport)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(sport.id, sport.name)}
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
                    <Modal.Title>{isEdit ? "Editar Deporte" : "Nuevo Deporte"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group controlId="formName">
                                    <Form.Label className="fw-semibold">Nombre del Deporte</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        placeholder="Ej. CrossFit, Natación..."
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group controlId="formObjective">
                                    <Form.Label className="fw-semibold">Objetivo</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="objective"
                                        placeholder="Ej. Mejorar fuerza, resistencia y condición física general."
                                        value={formData.objective}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.objective}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.objective}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formDuration">
                                    <Form.Label className="fw-semibold">Duración (minutos)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        inputMode="numeric"
                                        name="duration"
                                        placeholder="60"
                                        min={1}
                                        max={480}
                                        value={formData.duration}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.duration}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.duration}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6} className="d-flex align-items-end">
                                <Form.Group controlId="formStatus" className="mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        name="status"
                                        label="Activo por defecto"
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
                            {isEdit ? "Guardar Cambios" : "Registrar Deporte"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Card>
    )
}

export default SportsManagement
