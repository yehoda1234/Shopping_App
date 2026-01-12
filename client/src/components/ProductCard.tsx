import { Card, Button, Badge } from "react-bootstrap";
import type { Product } from "../types/product";
import { CartPlus } from "react-bootstrap-icons";

interface ProductCardProps {
    product: Product;
}


export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="h-100 shadow-sm border-0">
      {/* תמונה - אם אין תמונה נציג ריבוע אפור */}
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
          {product.imageUrl ? (
            <Card.Img 
                variant="top" 
                src={product.imageUrl} 
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div className="bg-secondary text-white d-flex align-items-center justify-content-center h-100">
                אין תמונה 📷
            </div>
          )}
          
          {/* תגית מחיר צפה */}
          <Badge bg="dark" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1rem' }}>
            ₪{product.price}
          </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <h6 className="text-muted">{product.title}</h6>
        
        <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
          {product.description.length > 60 
            ? product.description.substring(0, 60) + '...' 
            : product.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-3">
            <span className={product.stock > 0 ? "text-success" : "text-danger"}>
                {product.stock > 0 ? `במלאי: ${product.stock}` : "אזל המלאי"}
            </span>
            
            <Button variant="primary" disabled={product.stock === 0}>
                <CartPlus size={20} className="me-2" />
                הוסף
            </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
      









