import { Container, Button,  } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EmojiFrown } from "react-bootstrap-icons";


export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: '70vh' }}>

            <div className="mb-4">
                <EmojiFrown size={80} className="text-secondary"/>
            </div>

            <h1 className="display-1 fw-bold text-dark">404</h1>
            <h2 className="mb-4 text-muted">אופס! הדף לא נמצא</h2>


            <p className="lead mb-5" style={{ maxWidth: '500px' }}>
נראה שהגעת למקום לא מוכר. הדף שחיפשת הוסר, שינה את שמו או שמעולם לא היה קיים.     
            </p>

            <Button variant="primary" size="lg" className="px-5 rounded-pill" onClick={() => navigate('/')}>
        חזרה לדף הבית 🏠
      </Button>

    </Container>
  );
}