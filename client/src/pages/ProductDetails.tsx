import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner, Image, Stack } from 'react-bootstrap';
import { productsService } from '../services/api';
import { useAppDispatch, useAppSelector } from '../features/hooks'; 
import { addToCart } from '../features/cart/cartSlice';
import { CartPlus, LightningChargeFill, ArrowLeft } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import type { Product } from '../types/product';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth); 

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
            const data = await productsService.getOne(+id);
            setProduct(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('לא הצלחנו למצוא את המוצר');
        navigate('/store');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const checkAuth = () => {
      if (!isAuthenticated) {
          toast.info("נא להתחבר כדי להמשיך");
          navigate('/login');
          return false;
      }
      return true;
  };

  const handleAddToCart = () => {
      if (checkAuth() && product) {
          dispatch(addToCart({ productId: product.id, quantity: 1 }));
          toast.success('המוצר נוסף לעגלה! 🛒');
      }
  };

  const handleBuyNow = async () => {
      if (checkAuth() && product) {
          await dispatch(addToCart({ productId: product.id, quantity: 1 }));
          navigate('/checkout');    
      }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!product) return null;

  return (
    <Container className="py-5">
      <Button variant="link" className="text-decoration-none mb-4 text-secondary p-0" onClick={() => navigate(-1)}>
         <ArrowLeft className="me-2"/> חזרה לחנות
      </Button>

      <div className="bg-white p-4 p-md-5 rounded shadow-sm border">
        <Row className="align-items-center">
            
            <Col md={6} className="mb-4 mb-md-0 text-center">
                <div style={{ maxHeight: '500px', overflow: 'hidden', padding: '20px' }}>
                    <Image 
                        src={product.imageUrl} 
                        fluid 
                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                        alt={product.name}
                    />
                </div>
            </Col>

            <Col md={6}>
                {product.category && (
                    <Badge bg="info" className="mb-2">{product.category.name}</Badge>
                )}
                
                <h1 className="display-5 fw-bold mb-3">{product.name}</h1>
                <h3 className="text-primary fw-bold mb-3">₪{Number(product.price).toFixed(2)}</h3>
                
                <p className="lead text-muted mb-4" style={{ lineHeight: '1.8' }}>
                    {product.description || 'אין תיאור זמין למוצר זה.'}
                </p>

                <div className="mb-4">
                    <strong className="text-dark">מצב מלאי: </strong>
                    {product.stock > 0 ? (
                        <span className="text-success fw-bold">במלאי ({product.stock} יחידות)</span>
                    ) : (
                        <span className="text-danger fw-bold">אזל מהמלאי</span>
                    )}
                </div>

                {/* כפתורי פעולה */}
                <Stack direction="horizontal" gap={3}>
                    <Button 
                        variant="outline-primary" 
                        size="lg" 
                        disabled={product.stock === 0}
                        onClick={handleAddToCart}
                        className="px-4 rounded-pill flex-grow-1"
                    >
                        <CartPlus className="me-2 mb-1"/> הוסף לעגלה
                    </Button>

                    <Button 
                        variant="success" 
                        size="lg" 
                        disabled={product.stock === 0}
                        onClick={handleBuyNow}
                        className="px-4 rounded-pill flex-grow-1 fw-bold text-white"
                    >
                        <LightningChargeFill className="me-2 mb-1"/> קנה עכשיו
                    </Button>
                </Stack>

            </Col>
        </Row>
      </div>
    </Container>
  );
}