import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import heroImage from "../assets/sportclub.png";

function Home() {
    return (
        <div className="home-page bg-light">
            <Container className="text-center py-5">
                <Row className="align-items-center justify-content-center">
                    <Col md={6}>
                        <h1 className="display-4 mb-3">Bienvenido a SportClub</h1>
                        <p className="lead mb-4">
                            Tu plataforma integral para la gestión de actividades deportivas.
                            Únete a nuestra comunidad y lleva un control completo de tus entrenamientos, 
                            reservas y progresos.
                        </p>
                        <Button variant="primary" size="lg" as={Link} to="/login">
                            ¡Comienza ahora!
                        </Button>
                    </Col>
                    <Col md={6}>
                        <Image src={heroImage} fluid rounded />
                    </Col>
                </Row>
            </Container>
            <Container fluid className="bg-primary text-white text-center py-5 mt-5">
                <h2 className="mb-3">Ofrecemos una variedad de deportes y actividades</h2>
                <p className="lead">Desde fútbol hasta yoga, encuentra tu pasión y mantente activo.</p>
            </Container>
        </div>
    );
}
export default Home