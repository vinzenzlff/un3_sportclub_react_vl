import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Row, Col, Card, Badge, Spinner } from "react-bootstrap"
import Swal from "sweetalert2"
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService"

function AdminDashboard() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    // Límites de fecha de nacimiento (máximo 11 de junio de 2008, mínimo 120 años atrás)
    const maxDateStr = "2008-06-11"
    const minDateStr = (() => {
        const d = new Date()
        d.setFullYear(d.getFullYear() - 120)
        return d.toISOString().split("T")[0]
    })()

    // Estado para el modal de Crear/Editar
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [currentUserId, setCurrentUserId] = useState(null)

    // Campos del formulario
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "user",
        birth_date: "",
        must_change_password: false
    })

    // Errores de validación
    const [formErrors, setFormErrors] = useState({})

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudieron cargar los usuarios.",
                confirmButtonColor: "#dc3545"
            })
        } finally {
            setLoading(false)
        }
    }

    // Limpiar formulario y cerrar modal
    const handleCloseModal = () => {
        setShowModal(false)
        setIsEdit(false)
        setCurrentUserId(null)
        setFormData({
            full_name: "",
            email: "",
            password: "",
            role: "user",
            birth_date: "",
            must_change_password: false
        })
        setFormErrors({})
    }

    // Abrir modal para crear
    const handleOpenCreate = () => {
        setIsEdit(false)
        setShowModal(true)
    }

    // Abrir modal para editar
    const handleOpenEdit = (user) => {
        setIsEdit(true)
        setCurrentUserId(user.id)
        setFormData({
            full_name: user.full_name || "",
            email: user.email || "",
            password: "", // Contraseña vacía al editar
            role: user.role || "user",
            birth_date: user.birth_date || "",
            must_change_password: user.must_change_password || false
        })
        setShowModal(true)
    }

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))

        // Limpiar error del campo modificado
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    // Validar formulario en el frontend antes de enviar
    const validateForm = () => {
        const errors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formData.full_name.trim()) {
            errors.full_name = "El nombre completo es obligatorio."
        } else if (formData.full_name.trim().length < 3) {
            errors.full_name = "El nombre completo debe tener al menos 3 caracteres."
        }

        if (!formData.email.trim()) {
            errors.email = "El correo electrónico es obligatorio."
        } else if (!emailRegex.test(formData.email.trim())) {
            errors.email = "El correo electrónico no es válido."
        }

        if (!isEdit) {
            if (!formData.password) {
                errors.password = "La contraseña es obligatoria."
            } else if (formData.password.length < 8) {
                errors.password = "La contraseña debe tener mínimo 8 caracteres."
            }
        } else {
            if (formData.password && formData.password.length < 8) {
                errors.password = "La contraseña debe tener mínimo 8 caracteres."
            }
        }

        if (formData.birth_date) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birth_date)) {
                errors.birth_date = "La fecha de nacimiento debe tener formato AAAA-MM-DD."
            } else {
                const birthDateVal = new Date(formData.birth_date)
                const minVal = new Date(minDateStr)
                const maxVal = new Date(maxDateStr)
                if (birthDateVal > maxVal) {
                    errors.birth_date = "Debe ser mayor de edad)."
                } else if (birthDateVal < minVal) {
                    errors.birth_date = "La fecha de nacimiento no puede tener más de 120 años."
                }
            }
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Guardar cambios (Crear o Editar)
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        // Preparar payload
        const payload = {
            full_name: formData.full_name,
            email: formData.email,
            role: formData.role,
            birth_date: formData.birth_date || null,
            must_change_password: formData.must_change_password,
            metadata: { sports: [] } // Metadata por defecto requerida
        }

        // Agregar contraseña solo si se ingresó o si es un registro nuevo
        if (formData.password) {
            payload.password = formData.password
        }

        try {
            if (isEdit) {
                const updatedUser = await updateUser(currentUserId, payload)
                // Actualizar estado sin recargar la página
                setUsers((prev) => prev.map((u) => (u.id === currentUserId ? updatedUser : u)))

                Swal.fire({
                    icon: "success",
                    title: "Usuario Actualizado",
                    text: "El usuario ha sido modificado correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            } else {
                const newUser = await createUser(payload)
                // Agregar al estado sin recargar la página
                setUsers((prev) => [...prev, newUser])

                Swal.fire({
                    icon: "success",
                    title: "Usuario Creado",
                    text: "El usuario ha sido registrado correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            handleCloseModal()
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: error.message || "No se pudo procesar la solicitud.",
                confirmButtonColor: "#dc3545"
            })
        }
    }

    // Eliminar usuario
    const handleDelete = async (id, fullName) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar al usuario ${fullName}? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(id)
                    // Actualizar el estado de React sin recargar
                    setUsers((prev) => prev.filter((u) => u.id !== id))

                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El usuario ha sido eliminado correctamente.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    })
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error al eliminar",
                        text: error.message || "No se pudo eliminar al usuario.",
                        confirmButtonColor: "#dc3545"
                    })
                }
            }
        })
    }

    const getRoleBadge = (role) => {
        switch (role) {
            case "admin":
                return <Badge bg="danger">Administrador</Badge>
            case "coach":
                return <Badge bg="success">Entrenador</Badge>
            default:
                return <Badge bg="primary">Usuario</Badge>
        }
    }

    return (
        <Card className="shadow-sm border-0">
            <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center py-3">
                <h4 className="mb-0">Gestión de Usuarios</h4>
                <div className="d-flex gap-2">
                    <Button variant="outline-light" className="fw-bold" onClick={fetchUsers} disabled={loading}>
                        {loading ? "Refrescar" : "Refrescar"}
                    </Button>
                    <Button variant="light" className="text-danger fw-bold" onClick={handleOpenCreate}>
                        + Nuevo Usuario
                    </Button>
                </div>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-2 text-muted">Cargando usuarios...</p>
                    </div>
                ) : (
                    <>
                        {users.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-muted mb-0">No hay usuarios registrados en el sistema.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table striped hover align="middle">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre Completo</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Fecha Nacimiento</th>
                                            <th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.full_name}</td>
                                                <td>{user.email}</td>
                                                <td>{getRoleBadge(user.role)}</td>
                                                <td>{user.birth_date || <span className="text-muted">-</span>}</td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenEdit(user)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.id, user.full_name)}
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

            {/* Modal de Creación/Edición */}
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} size="lg">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>{isEdit ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="formFullName">
                                    <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="full_name"
                                        placeholder="Ej. Juan Pérez"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.full_name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.full_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="ejemplo@sportclub.cl"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formPassword">
                                    <Form.Label className="fw-semibold">
                                        Contraseña {isEdit && <span className="text-muted fw-normal">(Opcional)</span>}
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder={isEdit ? "Dejar en blanco para mantener la actual" : "Mínimo 8 caracteres"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formRole">
                                    <Form.Label className="fw-semibold">Rol</Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="user">Usuario</option>
                                        <option value="coach">Entrenador (Coach)</option>
                                        <option value="admin">Administrador</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="formBirthDate">
                                    <Form.Label className="fw-semibold">Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        min={minDateStr}
                                        max={maxDateStr}
                                        isInvalid={!!formErrors.birth_date}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.birth_date}
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
                            {isEdit ? "Guardar Cambios" : "Registrar Usuario"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Card>
    )
}

export default AdminDashboard
