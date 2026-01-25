import { Container, Row, Col, Card, Badge, ListGroup, Button } from 'react-bootstrap';
import { useAppSelector } from '../features/hooks';
import { PersonCircle, Google, Envelope, ShieldLock, BoxSeam } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
      return (
        <Container className="text-center mt-5">
            <h3>אנא התחבר כדי לצפות בפרופיל</h3>
            <Button variant="primary" onClick={() => navigate('/login')}>התחברות</Button>
        </Container>
      );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        
        {/* עמודה שמאלית: כרטיס ביקור ותמונה */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm border-0 text-center p-4 h-100">
            <Card.Body>
              <div className="mb-3 position-relative d-inline-block">
                {user.picture ? (
                    <img 
                        src={user.picture} 
                        alt="Profile" 
                        className="rounded-circle border border-4 border-light shadow"
                        style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                    />
                ) : (
                    <PersonCircle size={130} className="text-secondary" />
                )}
                
                {/* תגית אדמין קטנה ליד התמונה */}
                {user.role === 'ADMIN' && (
                    <span 
                        className="position-absolute bottom-0 start-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center border border-2 border-white"
                        style={{ width: '35px', height: '35px' }}
                        title="מנהל מערכת"
                    >
                        <ShieldLock size={18} />
                    </span>
                )}
              </div>
              
              <h3 className="fw-bold mb-1">{user.firstName} {user.lastName}</h3>
              <p className="text-muted mb-3">{user.email}</p>
              
              <Badge bg={user.role === 'ADMIN' ? 'primary' : 'success'} className="mb-4 px-3 py-2 rounded-pill">
                {user.role === 'ADMIN' ? 'מנהל מערכת' : 'לקוח רשום'}
              </Badge>

              <div className="d-grid gap-2">
                  <Button variant="outline-primary" onClick={() => navigate('/orders')}>
                      <BoxSeam className="me-2" />
                      ההזמנות שלי
                  </Button>
                  
                  {user.role === 'ADMIN' && (
                      <Button variant="dark" onClick={() => navigate('/admin')}>
                          <ShieldLock className="me-2" />
                          פאנל ניהול
                      </Button>
                  )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* עמודה ימנית: פרטים נוספים */}
        <Col md={8}>
            <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 py-3">
                    <h5 className="mb-0 fw-bold border-start border-4 border-primary ps-3">פרטי חשבון</h5>
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="py-4 d-flex align-items-center border-bottom-0">
                            <div className="bg-light p-3 rounded-circle me-3 text-primary">
                                <Envelope size={24} />
                            </div>
                            <div>
                                <small className="text-muted d-block text-uppercase" style={{fontSize: '0.8rem'}}>כתובת אימייל</small>
                                <span className="fw-medium fs-5">{user.email}</span>
                            </div>
                        </ListGroup.Item>

                        <ListGroup.Item className="py-4 d-flex align-items-center border-bottom-0">
                            <div className="bg-light p-3 rounded-circle me-3 text-primary">
                                <ShieldLock size={24} />
                            </div>
                            <div>
                                <small className="text-muted d-block text-uppercase" style={{fontSize: '0.8rem'}}>סוג חיבור</small>
                                <div className="d-flex align-items-center">
                                    <span className="fs-5 me-2">
                                        {user.provider === 'google' ? 'חשבון Google' : 'חשבון מקומי'}
                                    </span>
                                    {user.provider === 'google' && <Google className="text-danger" />}
                                </div>
                            </div>
                        </ListGroup.Item>

                        {/* אפשר להוסיף כאן עוד שדות בעתיד כמו טלפון, כתובת וכו' */}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Col>

      </Row>
    </Container>
  );
}