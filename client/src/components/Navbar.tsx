import { Navbar, Container, Nav, Badge, NavDropdown, Button } from 'react-bootstrap';
import { Cart3, PersonCircle, Shop, BoxArrowRight } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { logout } from '../features/auth/authSlice';
import { toggleCart } from '../features/cart/cartSlice';



export default function MainNavbar() {
  // קריאה למשתמש מתוך הזיכרון של Redux
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);


  const handleLogout = () => {
    dispatch(logout()); // מחיקת הטוקן מהזיכרון
    navigate('/login'); // מעבר לדף התחברות
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm mb-4" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <Shop size={25} />
          <span className="fw-bold">החנות שלי</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">בית</Nav.Link>
            <Nav.Link as={Link} to="/store">חנות</Nav.Link>
            {/* אם המשתמש הוא מנהל - נציג לו לינק לאדמין בעתיד */}
            {user?.role === 'ADMIN' && <Nav.Link as={Link} to="/admin">ניהול</Nav.Link>}
          </Nav>

          <Nav className="ms-auto d-flex align-items-center gap-3">
            
            {/* חלק 1: האם המשתמש מחובר? */}
            {isAuthenticated && user ? (
              <NavDropdown 
                title={
                  <span className="text-light d-flex align-items-center gap-2">
                    <PersonCircle size={20} />
                    {user.email} {/* בהמשך נשנה לשם פרטי כשנקבל אותו מהשרת */}
                  </span>
                } 
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">הפרופיל שלי</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">ההזמנות שלי</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <BoxArrowRight className="me-2" />
                  התנתק
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              /* חלק 2: אם הוא לא מחובר - תציג התחברות והרשמה */
              <>
                <Nav.Link as={Link} to="/register">הרשמה</Nav.Link>
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-1">
                   <PersonCircle size={20} />
                   <span>התחבר</span>
                </Nav.Link>
              </>
            )}

            {/* כפתור עגלה */}
            <Nav.Link
            onClick={() => dispatch(toggleCart())}
            className='position-relative'
            style={{cursor: 'pointer'}}>
               <Cart3 size={22} />
               {cartItemsCount > 0 && (
               <Badge pill bg="danger" style={{ position: 'absolute', top: '0', right: '-5px', fontSize: '0.6rem' }}>
                 {cartItemsCount}
               </Badge>
               )}
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}