import { useState } from 'react';
import { Container, Form, Button, Card, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify'; 

// 👇 הוספנו את הכלים של Redux
import { useAppDispatch } from '../features/hooks';
import { setCredentials } from '../features/auth/authSlice';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // 👇 הוספנו את זה

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('הסיסמאות אינן תואמות');
      return;
    }
    if (password.length < 6) {
      toast.error('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setLoading(true);
    try {
      // 1. הרשמה (יצירת המשתמש בשרת)
      await authService.register(email, password, firstName, lastName);
      
      // 2. התחברות אוטומטית (Auto-Login) 🚀
      // אנחנו מבצעים לוגין עם אותם פרטים בדיוק
      const loginData = await authService.login(email, password);
      
      // השרת מחזיר: { access_token: "...", user: { role: "USER", ... } }
      const token = loginData.access_token || loginData.accessToken;
      const user = loginData.user;

      // 3. שמירת הנתונים ב-Redux (בדיוק כמו בדף Login)
      if (token && user) {
          dispatch(setCredentials({ 
              user: user, 
              token: token 
          }));

          toast.success(`ברוך הבא, ${firstName}! נרשמת ונכנסת בהצלחה 🎉`);
          
          // 4. מעבר ישיר לחנות (במקום ללוגין)
          navigate('/');
      } else {
          // למקרה נדיר שההרשמה הצליחה אבל הלוגין האוטומטי נכשל
          toast.success('הרשמה הצליחה, אנא התחבר ידנית');
          navigate('/login');
      }

    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'ההרשמה נכשלה';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">הרשמה לחנות ✨</h2>
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>שם פרטי</Form.Label>
                    <Form.Control type="text" placeholder="ישראל" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>שם משפחה</Form.Label>
                    <Form.Control type="text" placeholder="ישראלי" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>כתובת אימייל</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>סיסמה</Form.Label>
            <InputGroup>
              <Form.Control type={showPassword ? "text" : "password"} placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>אימות סיסמה</Form.Label>
            <InputGroup>
              <Form.Control type={showConfirmPassword ? "text" : "password"} placeholder="******" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button">
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'הירשם והכנס מיד'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link></small>
        </div>
      </Card>
    </Container>
  );
}