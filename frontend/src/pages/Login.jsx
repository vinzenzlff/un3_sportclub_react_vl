import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"
import { loginUser, saveSession } from "../services/authService"
function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [registering, setRegistering] = useState(false)
    const [regName, setRegName] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [regRole, setRegRole] = useState("user")
    const [successMessage, setSuccessMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setSuccessMessage("")
        if (!email || !password) {
            setError("Todos los campos son obligatorios.")
            return
        }
        setLoading(true)
        try {
            const data = await loginUser({ email, password })
            saveSession(data.data.token, data.data.user)
            if (data.data.user.role === "admin") {
                navigate("/admin/dashboard")
            } else if (data.data.user.role === "coach") {
                navigate("/coach/dashboard")
            } else {
                navigate("/user/dashboard")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (event) => {
        event.preventDefault()
        setError("")
        setSuccessMessage("")
        if (!regName || !regEmail || !regPassword) {
            setError("Todos los campos del registro son obligatorios.")
            return
        }
        setLoading(true)
        try {
            const payload = {
                full_name: regName,
                email: regEmail,
                password: regPassword,
                role: "user"
            }
            console.log("Payload exacto enviado al backend:", payload)

            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            const data = await response.json()
            if (!response.ok) {
                if (response.status === 400 || data.message === "Payload inválido" || data.message === "Payload invalido") {
                    throw new Error("Datos inválidos. Asegúrate de ingresar un correo válido y una contraseña de al menos 8 caracteres")
                }
                throw new Error(data.message || "Error al registrar usuario")
            }
            setSuccessMessage("Usuario registrado exitosamente. Ahora puedes iniciar sesión.")
            setRegistering(false)
            setRegName("")
            setRegEmail("")
            setRegPassword("")
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "24rem" }} className="shadow">
                <Card.Body>
                    <div className="text-center mb-4">
                        <Link to="/">
                            <img src="/src/assets/sportclub.png" alt="SportClub Logo" width="80" className="mb-2" />
                        </Link>
                        <Card.Title className="text-center"></Card.Title>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    
                    {registering ? (
                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su nombre"
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingrese su correo"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="hidden" value={regRole} />
                            </Form.Group>
                            <Button type="submit" variant="success" className="w-100 mb-3" disabled={loading}>
                                {loading ? <Spinner size="sm" animation="border" /> : "Registrarse"}
                            </Button>
                            <Button variant="link" className="w-100 text-decoration-none text-muted" onClick={() => { setRegistering(false); setError(""); setSuccessMessage(""); }}>
                                ¿Ya tienes cuenta? Inicia sesión
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingrese su correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner size="sm" animation="border" /> Ingresando...
                                </>
                            ) : (
                                "Ingresar"
                            )}
                        </Button>
                        <Button variant="link" className="w-100 text-decoration-none text-muted mt-2" onClick={() => { setRegistering(true); setError(""); setSuccessMessage(""); }}>
                            ¿No tienes cuenta? Regístrate aquí
                        </Button>
                    </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    )
}
export default Login
