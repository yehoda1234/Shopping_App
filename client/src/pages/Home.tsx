import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productsService } from '../services/api';
import type { Product } from '../types/product';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'react-bootstrap-icons';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // טעינת "המוצרים החמים" (רק 4 האחרונים)
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await productsService.getAll();
        // לוקחים את 4 המוצרים האחרונים שנוספו
        const recent = data.sort((a, b) => b.id - a.id).slice(0, 4);
        setLatestProducts(recent);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div>
      {/* --- HERO SECTION (הבאנר המודרני) --- */}
      <section className="bg-light py-5 mb-5">
        <Container>
          <Row className="align-items-center flex-column-reverse flex-md-row">
            {/* צד שמאל: טקסט וכפתור */}
            <Col md={6} className="text-center text-md-start">
              <h1 className="display-4 fw-bold mb-3">הטכנולוגיה החדשה<br/><span className="text-primary">כבר כאן.</span></h1>
              <p className="lead text-muted mb-4">
                גלה את הקולקציה החדשה שלנו. המחירים הכי טובים, האיכות הכי גבוהה, והמשלוח? עלינו.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                  <Button as={Link as any} to="/store" variant="dark" size="lg" className="px-4 shadow-sm">
                    לקטלוג המלא <ArrowRight className="ms-2"/>
                  </Button>
                  <Button as={Link as any} to="/register" variant="outline-dark" size="lg" className="px-4">
                    הצטרף עכשיו
                  </Button>
              </div>
            </Col>
            
            {/* צד ימין: תמונה גדולה ומרשימה */}
            <Col md={6} className="mb-4 mb-md-0 text-center">
                <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop" 
                    alt="Hero Product" 
                    className="img-fluid rounded-3 shadow-lg"
                    style={{ maxHeight: '400px', objectFit: 'cover', transform: 'rotate(-2deg)' }}
                />
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- FEATURED PRODUCTS (הצצה למוצרים) --- */}
      <Container className="pb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h2 className="fw-bold">נחתו לאחרונה 🔥</h2>
                <p className="text-muted mb-0">המוצרים שהוספנו ממש עכשיו</p>
            </div>
            <Link to="/store" className="text-decoration-none fw-bold">לכל המוצרים &raquo;</Link>
        </div>

        {loading ? (
            <div className="text-center py-5"><Spinner animation="border"/></div>
        ) : (
            <Row>
                {latestProducts.map((product) => (
                    <Col key={product.id} xs={12} sm={6} md={3} className="mb-4">
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        )}
      </Container>
    </div>
  );
}