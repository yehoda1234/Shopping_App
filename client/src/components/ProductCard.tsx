import { Card, Button, Badge } from "react-bootstrap";
import type { Product } from "../types/product";
import { CartPlus, LightningChargeFill } from "react-bootstrap-icons"; // אייקון של ברק לקנייה מהירה
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    // הוספה רגילה (נשאר בחנות)
    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info("נא להתחבר כדי להוסיף לעגלה");
            navigate('/login');
            return;
        }
        dispatch(addToCart({ productId: product.id, quantity: 1 }));
        toast.success("נוסף לעגלה! 🛒");
    };

    // 👇 הלוגיקה החדשה: קנה עכשיו
    const handleBuyNow = async (e: any) => {
        e.stopPropagation(); // שלא ייכנס לדף מוצר

        if (!isAuthenticated) {
            toast.info("נא להתחבר כדי לרכוש");
            navigate('/login');
            return;
        }

        // 1. מוסיפים לעגלה (מחכים שזה יסתיים)
        await dispatch(addToCart({ productId: product.id, quantity: 1 }));
        
        // 2. טסים ישר לקופה
        navigate('/checkout');
    };

    return (
        <Card 
            className="h-100 shadow-sm border-0 product-card" 
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ 
                height: '220px', 
                overflow: 'hidden', 
                position: 'relative',
                padding: '15px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff' 
            }}>
                {product.imageUrl ? (
                    <Card.Img 
                        variant="top" 
                        src={product.imageUrl} 
                        alt={product.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', width: 'auto', objectFit: 'contain' }} 
                    />
                ) : (
                    <div className="bg-light text-muted d-flex align-items-center justify-content-center h-100 w-100 rounded">
                        אין תמונה 📷
                    </div>
                )}
                
                <Badge bg="white" text="dark" className="shadow-sm border" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.9rem' }}>
                    ₪{Number(product.price).toFixed(2)}
                </Badge>

                {product.category && (
                    <Badge bg="info" style={{ position: 'absolute', top: '10px', left: '10px', opacity: 0.9 }}>
                        {product.category.name}
                    </Badge>
                )}
            </div>

            <Card.Body className="d-flex flex-column pt-0">
                <Card.Title className="fw-bold mt-2 text-truncate" title={product.name}>
                    {product.name}
                </Card.Title>
                
                <Card.Text 
                    className="text-muted flex-grow-1 small" 
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '40px' }}
                >
                    {product.description}
                </Card.Text>

                <div className="mt-3 pt-2 border-top">
                    {/* סטטוס מלאי */}
                    <div className={`small fw-bold mb-2 ${product.stock > 0 ? "text-success" : "text-danger"}`}>
                        {product.stock > 0 ? `● במלאי` : "● אזל"}
                    </div>
                    
                    {/* 👇 שורת הכפתורים החדשה */}
                    <div className="d-flex gap-2">
                        {/* כפתור הוספה (רגיל) */}
                        <Button 
                            variant="outline-primary" 
                            size="sm"
                            disabled={product.stock === 0} 
                            onClick={handleAddToCart}
                            className="flex-grow-1 d-flex align-items-center justify-content-center"
                        >
                            <CartPlus size={18} className="me-1" /> הוסף
                        </Button>

                        {/* כפתור קנה עכשיו (חדש!) */}
                        <Button 
                            variant="success" 
                            size="sm"
                            disabled={product.stock === 0} 
                            onClick={handleBuyNow}
                            className="flex-grow-1 d-flex align-items-center justify-content-center fw-bold"
                        >
                            <LightningChargeFill size={14} className="me-1" /> קנה עכשיו
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}