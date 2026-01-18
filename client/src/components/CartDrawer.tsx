import { Offcanvas, ListGroup, Button, Image, Stack, ButtonGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../features/hooks';
import { closeCart, removeFromCart, updateItemQuantity } from '../features/cart/cartSlice';
import { Trash, Dash, Plus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isOpen, items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleQuantityChange = (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <Offcanvas show={isOpen} onHide={() => dispatch(closeCart())} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>העגלה שלי 🛍️</Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="d-flex flex-column">
        
        <div className="flex-grow-1 overflow-auto">
            {items.length === 0 ? (
                <div className="text-center mt-5 text-muted">
                    <h5>העגלה שלך ריקה 😢</h5>
                    <p>זה הזמן למלא אותה!</p>
                </div>
            ) : (
                <ListGroup variant="flush">
                    {items.map((item) => (
                        <ListGroup.Item key={item.id} className="py-3">
                            <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-3">
                                    
                                    {/* --- כאן קוד התמונה --- */}
                                    {item.product.imageUrl ? (
                                        <Image 
                                            src={item.product.imageUrl} 
                                            rounded 
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        // ריבוע אפור אם אין תמונה
                                        <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '5px' }}></div>
                                    )}
                                    {/* ----------------------- */}

                                    <div>
                                        <h6 className="mb-1">{item.product.name}</h6>
                                        <small className="text-muted">
                                            ₪{item.product.price} ליחידה
                                        </small>
                                    </div>
                                </div>
                                
                                <Button 
                                    variant="link" 
                                    className="text-danger p-0"
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                >
                                    <Trash size={18} />
                                </Button>
                            </div>

                            <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded">
                                <ButtonGroup size="sm" className="bg-white shadow-sm">
                                    <Button 
                                        variant="light" 
                                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Dash />
                                    </Button>
                                    <Button variant="light" disabled style={{width: '40px', color: 'black', fontWeight: 'bold'}}>
                                        {item.quantity}
                                    </Button>
                                    <Button 
                                        variant="light"
                                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                    >
                                        <Plus />
                                    </Button>
                                </ButtonGroup>
                                
                                <span className="fw-bold text-primary">
                                    ₪{(item.product.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>

        {items.length > 0 && (
            <div className="border-top pt-3 mt-3 bg-white">
                <Stack direction="horizontal" gap={3} className="mb-3 justify-content-between">
                    <h5 className="mb-0">סה"כ:</h5>
                    <h4 className="mb-0 text-primary">₪{total.toFixed(2)}</h4>
                </Stack>
                <Button variant="dark" size="lg" className="w-100 shadow" onClick={handleCheckout}>
                    מעבר לתשלום 💳
                </Button>
            </div>
        )}

      </Offcanvas.Body>
    </Offcanvas>
  );
}