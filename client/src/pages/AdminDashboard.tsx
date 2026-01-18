import { useEffect, useState } from 'react';
import { Container, Table, Button, Image, Badge, Spinner, Modal, Form, Row, Col, Tabs, Tab, Dropdown } from 'react-bootstrap';
import { useAppSelector } from '../features/hooks';
import { useNavigate } from 'react-router-dom';
import { productsService, ordersService } from '../services/api';
import type { Product } from '../types/product';
import { Trash, PencilSquare, PlusCircle, Save, Upload } from 'react-bootstrap-icons';

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // סטייטים למידע
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // סטייטים למוצרים (עריכה והוספה)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  // תיקון ה-0 והמינוס: מתחילים עם סטרינג ריק
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '' as any, stock: '' as any, file: null as File | null
  });

  // 1. טעינת מידע (מוצרים + הזמנות)
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    const loadData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          productsService.getAll(),
          ordersService.getMyOrders()
        ]);
        setProducts(productsData.sort((a, b) => b.id - a.id));
        setOrders(ordersData);
      } catch (error) {
        console.error("שגיאה בטעינת נתונים:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  // --- לוגיקה למוצרים ---
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('למחוק את המוצר?')) {
      await productsService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.file) {
        alert('חסרים פרטים (חובה למלא הכל כולל תמונה)'); return;
    }
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    if (newProduct.file) formData.append('file', newProduct.file);

    try {
        const created = await productsService.createProduct(formData);
        setProducts([created, ...products]);
        setShowAddModal(false);
        setNewProduct({ name: '', description: '', price: '', stock: '', file: null });
    } catch (e) { alert('שגיאה ביצירת מוצר'); }
  };

  const handleSaveChanges = async () => {
    if (!editingProduct) return;
    try {
        await productsService.updateProduct(editingProduct.id, editingProduct);
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setShowEditModal(false);
    } catch (e) { alert('שגיאה בעדכון'); }
  };

  // --- לוגיקה להזמנות (שינוי סטטוס) ---
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
        await ordersService.updateStatus(orderId, newStatus);
        // עדכון מקומי בטבלה כדי שנראה את השינוי מיד
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
        alert('שגיאה בעדכון סטטוס');
    }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'PENDING': return 'warning'; // צהוב
          case 'SHIPPED': return 'primary'; // כחול
          case 'DELIVERED': return 'success'; // ירוק
          case 'CANCELLED': return 'danger'; // אדום
          default: return 'secondary';
      }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <h2 className="mb-4">פאנל ניהול 🛠️</h2>

      {/* מערכת הטאבים */}
      <Tabs defaultActiveKey="products" className="mb-4">
        
        {/* --- טאב 1: מוצרים --- */}
        <Tab eventKey="products" title="ניהול מוצרים 📦">
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="me-2" /> הוסף מוצר
                </Button>
            </div>
            <Table striped bordered hover className="bg-white shadow-sm align-middle">
                <thead className="bg-light">
                    <tr><th>ID</th><th>תמונה</th><th>שם</th><th>מחיר</th><th>מלאי</th><th>פעולות</th></tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.imageUrl ? <Image src={p.imageUrl} style={{width:40, height:40, objectFit:'cover'}} rounded /> : '-'}</td>
                            <td className="fw-bold">{p.name}</td>
                            <td>₪{p.price}</td>
                            <td><Badge bg={p.stock > 0 ? 'success':'danger'}>{p.stock}</Badge></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button variant="outline-primary" size="sm" onClick={() => {setEditingProduct(p); setShowEditModal(true)}}><PencilSquare/></Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(p.id)}><Trash/></Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Tab>

        {/* --- טאב 2: הזמנות (החדש!) --- */}
        <Tab eventKey="orders" title="ניהול הזמנות 📑">
            {orders.length === 0 ? <p className="text-center mt-3">אין הזמנות עדיין.</p> : 
            <Table striped bordered hover className="bg-white shadow-sm align-middle">
                <thead className="bg-light">
                    <tr><th>#</th><th>לקוח</th><th>תאריך</th><th>סכום</th><th>סטטוס</th><th>פעולות</th></tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>
                                <div className="fw-bold">{order.user?.email || 'אורח'}</div>
                                <small className="text-muted">{order.shippingAddress} | {order.phone}</small>
                                {order.comment && <div className="text-info small">הערה: {order.comment}</div>}
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString('he-IL')}</td>
                            <td className="fw-bold">₪{Number(order.totalAmount).toFixed(2)}</td>
                            <td>
                                <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                            </td>
                            <td>
                                {/* כפתור בחירה (Dropdown) לשינוי סטטוס */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-dark" size="sm" id={`dropdown-${order.id}`}>
                                        שנה סטטוס
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'PENDING')}>🟡 ממתין</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'SHIPPED')}>🔵 נשלח</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'DELIVERED')}>🟢 נמסר</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="text-danger">🔴 ביטול</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            }
        </Tab>

      </Tabs>

      {/* --- מודלים (חלונות קופצים) נשארים אותו דבר --- */}
      
      {/* הוספה */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>הוספת מוצר</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-2"><Form.Label>שם</Form.Label><Form.Control type="text" onChange={(e: any) => setNewProduct({...newProduct, name: e.target.value})} /></Form.Group>
                <Form.Group className="mb-2"><Form.Label>תיאור</Form.Label><Form.Control as="textarea" onChange={(e: any) => setNewProduct({...newProduct, description: e.target.value})} /></Form.Group>
                <Row>
                    <Col><Form.Group className="mb-2"><Form.Label>מחיר</Form.Label><Form.Control type="number" min="0" onChange={(e: any) => setNewProduct({...newProduct, price: e.target.value})} /></Form.Group></Col>
                    <Col><Form.Group className="mb-2"><Form.Label>מלאי</Form.Label><Form.Control type="number" min="0" onChange={(e: any) => setNewProduct({...newProduct, stock: e.target.value})} /></Form.Group></Col>
                </Row>
                <Form.Group className="mb-2"><Form.Label>תמונה</Form.Label><Form.Control type="file" onChange={(e: any) => setNewProduct({...newProduct, file: e.target.files[0]})} /></Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>ביטול</Button>
            <Button variant="success" onClick={handleCreateProduct}>צור</Button>
        </Modal.Footer>
      </Modal>

      {/* עריכה */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>עריכת מוצר</Modal.Title></Modal.Header>
        <Modal.Body>
            {editingProduct && <Form>
                <Form.Group className="mb-2"><Form.Label>שם</Form.Label><Form.Control value={editingProduct.name} onChange={(e: any) => setEditingProduct({...editingProduct, name: e.target.value})} /></Form.Group>
                <Form.Group className="mb-2"><Form.Label>מחיר</Form.Label><Form.Control value={editingProduct.price} onChange={(e: any) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} /></Form.Group>
                <Form.Group className="mb-2"><Form.Label>מלאי</Form.Label><Form.Control value={editingProduct.stock} onChange={(e: any) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} /></Form.Group>
            </Form>}
        </Modal.Body>
        <Modal.Footer><Button onClick={handleSaveChanges}>שמור</Button></Modal.Footer>
      </Modal>

    </Container>
  );
}