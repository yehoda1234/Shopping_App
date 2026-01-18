import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

export default function Register() {
  // שדות הטופס
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // שליטה על הצגת סיסמאות
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ולידציות בצד לקוח
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setLoading(true);
    try {
      // שליחת כל הנתונים לשרת
      await authService.register(email, password, firstName, lastName);
      
      // אם עבר בהצלחה - מעבירים ללוגין
      navigate('/login'); 
    } catch (err: any) {
      console.error(err);
      // חילוץ הודעת השגיאה מהשרת
      const message = err.response?.data?.message || 'ההרשמה נכשלה. נסה שוב.';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">הרשמה לחנות ✨</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          
          {/* שמות פרטי ומשפחה בשורה אחת */}
          <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>שם פרטי</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="ישראל" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                    />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>שם משפחה</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="ישראלי" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                    />
                </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>כתובת אימייל</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </Form.Group>

          {/* סיסמה עם עין */}
          <Form.Group className="mb-3">
            <Form.Label>סיסמה</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showPassword ? "text" : "password"} 
                placeholder="******" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* אימות סיסמה עם עין נפרדת */}
          <Form.Group className="mb-4">
            <Form.Label>אימות סיסמה</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="******" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
              >
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'הירשם עכשיו'}
          </Button>

        </Form>

        <div className="text-center mt-3">
          <small>
            כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}