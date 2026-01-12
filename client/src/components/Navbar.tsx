import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { Cart3, PersonCircle, Shop } from "react-bootstrap-icons";
import { Link } from "react-router-dom";


export default function mainNavbar() {
    return (
        <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm mb-4" sticky="top">
          <Container>
            <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                <Shop size={25} />
                <span className="fw-bold">החנות שלי</span>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-navbar" />

            <Navbar.Collapse id="main-navbar">

                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/">בית</Nav.Link>
                    <Nav.Link as={Link} to="/store">חנות</Nav.Link>
                    <Nav.Link as={Link} to="/about">אודות</Nav.Link>
                    </Nav>

                <Nav className="ms-auto d-flex align-items-center gap-3">
                    <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-1">
                        <PersonCircle size={20} />
                        <span>התחבר</span>
                    </Nav.Link>


                    <Nav.Link as={Link} to="/cart" className="position-relative">
                        <Cart3 size={22} />
                        <Badge pill bg="danger" style={{ position: 'absolute', top: '0', right: '-5px', fontSize: '0.6rem'}}>
                            0
                        </Badge>
                    </Nav.Link>

                </Nav>  
            </Navbar.Collapse>
          </Container>
        </Navbar>
    );
}