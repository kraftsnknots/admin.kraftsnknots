
import "../styles/Dashboard.css";
import Sidebar from "../pages/Sidebar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

const Dashboard = () => {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Navbar className="bg-body-tertiary">
                        <Container>
                            <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                            <Navbar.Toggle />
                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text>
                                    Signed in as: <a href="#login">Mark Otto</a>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Col>
            </Row>
        </Container>
    )
}
export default Dashboard;
