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
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // חישוב סכום סופי
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. שליחת ההזמנה לשרת
      await ordersService.createOrder(address, phone, comment);
      
      // 2. ניקוי העגלה המקומית (כי השרת כבר ניקה אצלו את העגלה אחרי ההזמנה)
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

  // אם מנסים להיכנס לדף כשהעגלה ריקה - נחזיר אותם לחנות
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
        {/* צד ימין: טופס פרטים */}
        <Col md={8}>
          <Card className="shadow-sm p-4 mb-4">
            <h4 className="mb-3">פרטי משלוח</h4>
            <Form onSubmit={handlePlaceOrder}>
              
              <Form.Group className="mb-3">
                <Form.Label>כתובת למשלוח *</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="רחוב, מספר, עיר" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
              </Form.Group>

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
                <Form.Label>הערות לשליח (אופציונלי)</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>

              <Button variant="success" size="lg" type="submit" className="w-100 mt-3" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : `שלם עכשיו ₪${total.toFixed(2)}`}
              </Button>
            </Form>
          </Card>
        </Col>

        {/* צד שמאל: סיכום הזמנה */}
        <Col md={4}>
          <Card className="shadow-sm">
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
                <span className="text-primary">₪{total.toFixed(2)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}