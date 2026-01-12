import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import type { Product } from '../types/product';
import { productsService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // קריאה לשרת
    const fetchProducts = async () => {
      try {
        const data = await productsService.getAll();
        setProducts(data);
      } catch (err) {
        setError('לא הצלחנו לטעון את המוצרים. נסה שוב מאוחר יותר.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
        <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p>טוען מוצרים...</p>
        </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="text-center mt-5">{error}</Alert>;
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">המוצרים שלנו ✨</h2>
      
      <Row>
        {products.map((product) => (
          // xs=1 (טור אחד בנייד), md=3 (שלושה טורים במחשב רגיל), lg=4 (ארבעה במסך ענק)
          <Col key={product.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      
      {products.length === 0 && (
          <div className="text-center text-muted">עדיין אין מוצרים בחנות.</div>
      )}
    </Container>
  );
}