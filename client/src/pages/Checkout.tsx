import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../features/hooks';
import { ordersService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { clearLocalCart } from '../features/cart/cartSlice';

export default function Checkout() {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // שדות הטופס
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');    
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState(''); 
  const [comment, setComment] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // חישוב סכום סופי
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // בדיקה פשוטה וקלילה רק למספר כרטיס
    if (cardNumber.length < 16) {
        setError('נא להזין מספר אשראי תקין (16 ספרות)');
        setLoading(false);
        return;
    }

    try {
      // 1. שליחת ההזמנה לשרת
      const fullAddress = `${address}, ${city}`;   
      await ordersService.createOrder(fullAddress, phone, comment);
      
      // 2. ניקוי העגלה המקומית
      dispatch(clearLocalCart());

      // 3. הודעת הצלחה ומעבר לדף הבית
      alert("ההזמנה בוצעה בהצלחה! תודה שקנית אצלנו 🚀");
      navigate('/');
      
    } catch (err: any) {
      console.error(err);
      setError('משהו השתבש בביצוע ההזמנה. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  // פונקציה שדואגת שיכניסו רק מספרים
  const handleCardNumberChange = (e: any) => {
      const val = e.target.value.replace(/\D/g, '').slice(0, 16); 
      setCardNumber(val);
  };

  if (items.length === 0) {
      return (
          <Container className="text-center mt-5">
              <h2>העגלה שלך ריקה 🛒</h2>
              <p>אי אפשר לבצע הזמנה בלי מוצרים.</p>
              <Button variant="primary" onClick={() => navigate('/')}>חזור לחנות</Button>
          </Container>
      )
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">סיום הזמנה ותשלום 💳</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {/* צד ימין: טופס פרטים ואשראי */}
        <Col md={8}>
          <Form onSubmit={handlePlaceOrder}>
            
            <Card className="shadow-sm p-4 mb-4">
                <h4 className="mb-3 text-primary">פרטי הזמנה</h4>
                
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>עיר *</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label> רחוב ומספר דירה *</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>טלפון ליצירת קשר *</Form.Label>
                    <Form.Control 
                        type="tel" 
                        placeholder="050-0000000" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>מספר אשראי *</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={16}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>הערות לשליח (אופציונלי)</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={2} 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Form.Group>

                <Button variant="success" size="lg" type="submit" className="w-100 mt-2" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : `שלם עכשיו ₪${total.toFixed(2)}`}
                </Button>
            </Card>

          </Form>
        </Col>

        {/* צד שמאל: סיכום הזמנה */}
        <Col md={4}>
            <Card className="shadow-sm sticky-top" style={{ top: '100px', zIndex: 1 }}>
            <Card.Header className="bg-light fw-bold">סיכום הזמנה</Card.Header>
            <ListGroup variant="flush">
              {items.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.product.name}</strong>
                    <div className="text-muted small">x {item.quantity}</div>
                  </div>
                  <span>₪{(item.product.price * item.quantity).toFixed(2)}</span>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="d-flex justify-content-between align-items-center bg-white fw-bold border-top">
                <span>סה"כ לתשלום:</span>
                <span className="text-primary fs-5">₪{total.toFixed(2)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}