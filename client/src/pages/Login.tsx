import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useAppDispatch } from '../features/hooks';
import { setCredentials } from '../features/auth/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. שליחת בקשה לשרת
      const data = await authService.login(email, password);
      
      const token = data.access_token || data.accessToken;
      const user = data.user;

      if (token && user) {
        // 2. שמירה ב-Redux בצורה נקייה
        dispatch(setCredentials({ 
            user: user, 
            token: token 
        }));

        // 3. ניתוב לפי התפקיד שהגיע מהשרת
        if (user.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/');
        }
      } else {
        // מקרה קצה: השרת החזיר תשובה ריקה
        setError('התחברות נכשלה: השרת לא החזיר פרטי משתמש');
      }

    } catch (err: any) {
      console.error(err);
      setError('אימייל או סיסמה שגויים');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">כניסה לחשבון 👋</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          
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

          <Form.Group className="mb-4">
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

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'התחבר'}
          </Button>

        </Form>

        <div className="text-center my-3">
          <span className='text-muted'>או</span>
        </div>

        <Button
          variant='outline-danger'
          className='w-100 d-flex align-items-center justify-content-center gap-2 mb-3'
          onClick={() => window.location.href = 'http://127.0.0.1:3000/auth/google'}
          type='button'
        >


          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="m21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.61C5,9.05 8.36,5.97 12.19,5.97C14.36,5.97 16.25,7.01 17.16,7.72L19.57,5.59C17.65,3.78 15.15,2.62 12.19,2.62C6.98,2.62 2.62,6.97 2.62,12.16C2.62,17.34 6.98,21.7 12.19,21.7C16.85,21.7 21.63,18.37 21.63,12.53C21.63,11.89 21.49,11.37 21.35,11.1Z" />
          </svg>
           התחבר באמצעות Google
           </Button>


        <div className="text-center mt-3">
          <small>
            אין לך חשבון? <Link to="/register">הירשם כאן</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}