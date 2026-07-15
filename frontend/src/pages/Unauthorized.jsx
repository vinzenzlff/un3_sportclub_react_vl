import { Link } from "react-router-dom"
import { Alert, Button, Container } from "react-bootstrap"

function Unauthorized() {
    return (
        <Container className="mt-5">
            <Alert variant="danger">
                <Alert.Heading>Acceso no autorizado</Alert.Heading>
                <p>No tienes permisos para acceder a esta sección.</p>
                <Link to="/login">
                    <Button variant="danger">Volver al login</Button>
                </Link>
            </Alert>
        </Container>
    )
}

export default Unauthorized