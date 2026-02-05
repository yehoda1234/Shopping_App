import { useEffect, useState } from 'react';
import { Container, Table, Button, Image, Badge, Spinner, Modal, Form, Row, Col, Tabs, Tab, Dropdown, Accordion, Card } from 'react-bootstrap';
import { useAppSelector } from '../features/hooks';
import { useNavigate } from 'react-router-dom';
import { productsService, ordersService, categoriesService } from '../services/api';
import type { Product } from '../types/product';
import { Trash, PencilSquare, PlusCircle, FolderPlus, PersonCircle, BoxSeam, ArrowCounterclockwise } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

interface Category {
    id: number;
    name: string;
}

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [trashProducts, setTrashProducts] = useState<Product[]>([]); 
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [editingFile, setEditingFile] = useState<File | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '' as any, stock: '' as any, categoryId: '' as any, file: null as File | null
  });
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, trashData, ordersData, categoriesData] = await Promise.all([
          productsService.getAll(),
          productsService.getTrash(), 
          ordersService.getAllOrders(),
          categoriesService.getAll()
      ]);

      if (Array.isArray(productsData)) setProducts(productsData.sort((a, b) => b.id - a.id));
      if (Array.isArray(trashData)) setTrashProducts(trashData); 
      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(categoriesData)) setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByUser = () => {
      const groups: { [email: string]: any[] } = {};
      orders.forEach(order => {
          const email = order.user?.email || 'אורח';
          if (!groups[email]) groups[email] = [];
          groups[email].push(order);
      });
      return groups;
  };

  const groupedOrders = groupOrdersByUser();

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('למחוק את המוצר? (הוא יעבור לסל המחזור)')) {
      try {
        await productsService.deleteProduct(id);
        const deletedItem = products.find(p => p.id === id);
        if (deletedItem) {
            setTrashProducts([deletedItem, ...trashProducts]);
            setProducts(products.filter(p => p.id !== id));
        }
        toast.success('המוצר הועבר לסל המחזור! ♻️');
      } catch (e) { toast.error('שגיאה במחיקת המוצר');}
    }
  };

  const handleRestoreProduct = async (id: number) => {
      try {
          await productsService.restoreProduct(id);
          const restoredItem = trashProducts.find(p => p.id === id);
          if (restoredItem) {
              setProducts([restoredItem, ...products]);
              setTrashProducts(trashProducts.filter(p => p.id !== id));
          }
          toast.success('המוצר שוחזר בהצלחה! 🎉');
      } catch (e) {
          toast.error('שגיאה בשחזור המוצר');
      }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.warning('נא למלא שם ומחיר')
    return;
    }
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      if (newProduct.categoryId) formData.append('categoryId', newProduct.categoryId);
      if (newProduct.file) formData.append('file', newProduct.file);

      const created = await productsService.createProduct(formData);
      const categoryObj = categories.find(c => c.id == newProduct.categoryId);
      const productWithCat = { ...created, category: categoryObj };
      setProducts([productWithCat, ...products]);
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', categoryId: '', file: null });
      toast.success('מוצר חדש נוסף למערכת! 🎉');
    } catch (e) { toast.error('שגיאה ביצירת המוצר') }
  };

  // פונקציה מעודכנת לשמירת שינויים 
  const handleSaveChanges = async () => {
    if (!editingProduct) return;
    try {
      // אנחנו בונים FormData כדי לתמוך בשליחת קובץ
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('price', editingProduct.price);
      formData.append('stock', editingProduct.stock);
      formData.append('description', editingProduct.description || '');

      if (editingProduct.categoryId) {
          formData.append('categoryId', editingProduct.categoryId);
      }

      // אם נבחר קובץ חדש - נוסיף אותו
      if (editingFile) {
          formData.append('file', editingFile);
      }

      await productsService.updateProduct(editingProduct.id, formData as any);
      
      loadData();
      setShowEditModal(false);
      setEditingFile(null); // איפוס הקובץ
      toast.info('המוצר עודכן בהצלחה 👍');
    } catch (e) { toast.error('שגיאה בעדכון המוצר');}
  };

  const handleCreateCategory = async () => {
      if(!newCatName) return;
      try {
          const cat = await categoriesService.create(newCatName);
          setCategories([...categories, cat]);
          setNewCatName('');
          toast.success('קטגוריה נוצרה! 📂');
    } catch(e) { toast.error('שגיאה ביצירת קטגוריה'); }  };

  const handleDeleteCategory = async (id: number) => {
      if (window.confirm('בטוח שאתה רוצה למחוק את הקטגוריה? (המוצרים בה יישארו ללא קטגוריה)')) {
          try {
              await categoriesService.delete(id);
              setCategories(categories.filter(c => c.id !== id));
              toast.success('קטגוריה נמחקה! 🗑️');
          } catch (e) { toast.error('שגיאה במחיקת קטגוריה'); }
      }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
        await ordersService.updateStatus(orderId, newStatus);
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) { alert('שגיאה בעדכון סטטוס'); }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'PENDING': return 'warning';
          case 'SHIPPED': return 'primary';
          case 'DELIVERED': return 'success';
          case 'CANCELLED': return 'danger';
          default: return 'secondary';
      }
  };

  const handleNumberChange = (e: any, field: 'price' | 'stock', isEdit: boolean) => {
      const val = e.target.value;
      if (val === '' || (!isNaN(val) && Number(val) >= 0)) {
          if (isEdit && editingProduct) {
              setEditingProduct({ ...editingProduct, [field]: val });
          } else {
              setNewProduct({ ...newProduct, [field]: val });
          }
      }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>פאנל ניהול 🛠️</h2>
        <Button variant="outline-primary" size="sm" onClick={() => setShowCatModal(true)}>
            <FolderPlus className="me-2"/> קטגוריות
        </Button>
      </div>

      <Tabs defaultActiveKey="products" className="mb-4">
        
      
        <Tab eventKey="products" title="ניהול מוצרים 📦">
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="me-2" /> הוסף מוצר
                </Button>
            </div>

            {/* תצוגת מחשב (טבלה) */}
            <div className="d-none d-md-block">
                <Table striped bordered hover className="bg-white shadow-sm align-middle">
                    <thead><tr><th>ID</th><th>תמונה</th><th>שם</th><th>קטגוריה</th><th>מחיר</th><th>מלאי</th><th>פעולות</th></tr></thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.imageUrl ? <Image src={p.imageUrl} style={{width:40}} rounded /> : '-'}</td>
                                <td className="fw-bold">{p.name}</td>
                                <td>{p.category ? <Badge bg="info">{p.category.name}</Badge> : <span className="text-muted">-</span>}</td>
                                <td>₪{p.price}</td>
                                <td><Badge bg={p.stock > 0 ? 'success':'danger'}>{p.stock}</Badge></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button variant="outline-primary" size="sm" onClick={() => {
                                            setEditingProduct({ ...p, categoryId: p.category?.id || '' }); 
                                            setEditingFile(null); // איפוס קובץ קודם
                                            setShowEditModal(true);
                                        }}><PencilSquare/></Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(p.id)}><Trash/></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* תצוגת מובייל (כרטיסיות) */}
            <div className="d-md-none">
                {products.map(p => (
                    <Card key={p.id} className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-3">
                                    {p.imageUrl && <Image src={p.imageUrl} style={{width:50, height:50, objectFit:'contain'}} rounded />}
                                    <div>
                                        <h6 className="mb-0 fw-bold">{p.name}</h6>
                                        <small className="text-muted">#{p.id}</small>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="fw-bold text-primary">₪{p.price}</div>
                                    <Badge bg={p.stock > 0 ? 'success':'danger'}>{p.stock} במלאי</Badge>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                <div>
                                    {p.category ? <Badge bg="light" text="dark" className="border">{p.category.name}</Badge> : <small>-</small>}
                                </div>
                                <div className="d-flex gap-2">
                                    <Button variant="outline-primary" size="sm" onClick={() => {
                                        setEditingProduct({ ...p, categoryId: p.category?.id || '' }); 
                                        setEditingFile(null); // איפוס
                                        setShowEditModal(true);
                                    }}><PencilSquare/></Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(p.id)}><Trash/></Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Tab>

     
        {/* טאב סל מחזור ♻️         */}
        <Tab eventKey="trash" title={`סל מחזור ♻️ (${trashProducts.length})`}>
            {trashProducts.length === 0 ? <p className="text-center mt-3 text-muted">סל המחזור ריק.</p> :
            <div className="table-responsive">
                <Table striped bordered hover className="bg-white shadow-sm align-middle mt-3">
                    <thead className="table-danger">
                        <tr>
                            <th>ID</th>
                            <th>תמונה</th> 
                            <th>שם</th>
                            <th>מחיר</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trashProducts.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.imageUrl ? <Image src={p.imageUrl} style={{width:40}} rounded /> : '-'}</td>
                                <td className="fw-bold text-decoration-line-through text-muted">{p.name}</td>
                                <td>₪{p.price}</td>
                                <td>
                                    <Button variant="success" size="sm" onClick={() => handleRestoreProduct(p.id)}>
                                        <ArrowCounterclockwise className="me-2"/> שחזר מוצר
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            }
        </Tab>

        {/* טאב הזמנות              */}

        <Tab eventKey="orders" title="ניהול הזמנות 📑">
             {orders.length === 0 ? <p className="text-center mt-3">אין הזמנות.</p> : 
            
            <Accordion defaultActiveKey="0" className="mt-3 shadow-sm">
                {Object.keys(groupedOrders).map((email, index) => {
                    const userOrders = groupedOrders[email];
                    const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
                    
                    return (
                        <Accordion.Item eventKey={index.toString()} key={email}>
                            <Accordion.Header>
                                <div className="d-flex justify-content-between w-100 me-3 align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                                        <PersonCircle size={24} className="text-primary"/>
                                        <div className="lh-1">
                                            <div className="fw-bold" style={{fontSize: '0.9rem'}}>{email}</div>
                                            <div className="text-muted d-md-none" style={{fontSize: '0.75rem'}}>
                                                {userOrders.length} הזמנות • ₪{totalSpent.toFixed(0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-none d-md-block text-muted small">
                                        <Badge bg="secondary" pill className="me-2">{userOrders.length} הזמנות</Badge>
                                        סה"כ: <span className="fw-bold text-dark">₪{totalSpent.toFixed(2)}</span>
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body className="bg-light p-2 p-md-3">
                                
                                {/* תצוגת מחשב להזמנות פנימיות */}
                                <div className="d-none d-md-block">
                                    <Table bordered hover size="sm" className="bg-white mb-0 shadow-sm text-center">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th><th>תאריך</th><th>פרטים</th><th>סכום</th><th>סטטוס</th><th>פעולות</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString('he-IL')}</td>
                                                    <td><small>{order.shippingAddress} | {order.phone}</small></td>
                                                    <td className="fw-bold">₪{Number(order.totalAmount).toFixed(2)}</td>
                                                    <td><Badge bg={getStatusColor(order.status)}>{order.status}</Badge></td>
                                                    <td>
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="outline-dark" size="sm">סטטוס</Dropdown.Toggle>
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
                                </div>

                                {/* תצוגת מובייל להזמנות פנימיות */}
                                <div className="d-md-none">
                                    {userOrders.map(order => (
                                        <Card key={order.id} className="mb-2 border bg-white">
                                            <Card.Body className="p-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <Badge bg="light" text="dark" className="border">#{order.id}</Badge>
                                                    <span className="text-muted small">{new Date(order.createdAt).toLocaleDateString('he-IL')}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <div className="fw-bold">₪{Number(order.totalAmount).toFixed(2)}</div>
                                                    <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                                                </div>
                                                <div className="small text-muted mb-3">
                                                    <BoxSeam className="me-1"/> {order.shippingAddress}
                                                </div>
                                                <Dropdown className="d-grid gap-2">
                                                    <Dropdown.Toggle variant="outline-secondary" size="sm">שינוי סטטוס</Dropdown.Toggle>
                                                    <Dropdown.Menu className="w-100">
                                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'PENDING')}>🟡 ממתין</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'SHIPPED')}>🔵 נשלח</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'DELIVERED')}>🟢 נמסר</Dropdown.Item>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item onClick={() => handleStatusChange(order.id, 'CANCELLED')} className="text-danger">🔴 ביטול</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>

                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
            }
        </Tab>
      </Tabs>

      {/* --- מודלים --- */}
      <Modal show={showCatModal} onHide={() => setShowCatModal(false)} centered scrollable>
         {/* ... מודל קטגוריות  ... */}
         <Modal.Header closeButton><Modal.Title>ניהול קטגוריות</Modal.Title></Modal.Header>
        <Modal.Body>
            <div className="mb-4">
                <h6 className="text-muted mb-2">קטגוריות קיימות:</h6>
                {categories.length === 0 ? <p className="text-muted small">אין קטגוריות עדיין.</p> : 
                <ul className="list-group list-group-flush border rounded">
                    {categories.map(cat => (
                        <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{cat.name}</span>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCategory(cat.id)} title="מחק קטגוריה">
                                <Trash size={14}/>
                            </Button>
                        </li>
                    ))}
                </ul>
                }
            </div>
            <hr />
            <div>
                <h6 className="text-muted mb-2">הוסף חדשה:</h6>
                <div className="d-flex gap-2">
                    <Form.Control placeholder="שם הקטגוריה..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                    <Button variant="primary" onClick={handleCreateCategory}>הוסף</Button>
                </div>
            </div>
        </Modal.Body>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
         {/* ...מודל הוספה  ... */}
         <Modal.Header closeButton><Modal.Title>מוצר חדש</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control className="mb-2" placeholder="שם המוצר" onChange={(e: any) => setNewProduct({...newProduct, name: e.target.value})} />
                <Form.Select className="mb-2" value={newProduct.categoryId} onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}>
                    <option value="">בחר קטגוריה...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Form.Select>
                <Form.Control className="mb-2" as="textarea" placeholder="תיאור" onChange={(e: any) => setNewProduct({...newProduct, description: e.target.value})} />
                <Row>
                    <Col>
                        <Form.Control className="mb-2" type="number" min="0" placeholder="מחיר" 
                            value={newProduct.price} onChange={(e) => handleNumberChange(e, 'price', false)} />
                    </Col>
                    <Col>
                        <Form.Control className="mb-2" type="number" min="0" placeholder="מלאי" 
                            value={newProduct.stock} onChange={(e) => handleNumberChange(e, 'stock', false)} />
                    </Col>
                </Row>
                <Form.Control className="mb-2" type="file" onChange={(e: any) => setNewProduct({...newProduct, file: e.target.files[0]})} />
            </Form>
        </Modal.Body>
        <Modal.Footer><Button onClick={handleCreateProduct}>צור מוצר</Button></Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>עריכת מוצר</Modal.Title></Modal.Header>
        <Modal.Body>
            {editingProduct && <Form>
                <Form.Control className="mb-2" value={editingProduct.name} onChange={(e: any) => setEditingProduct({...editingProduct, name: e.target.value})} />
                <Form.Select className="mb-2" value={editingProduct.categoryId} onChange={(e) => setEditingProduct({...editingProduct, categoryId: e.target.value})}>
                    <option value="">ללא קטגוריה</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Form.Select>
                <Row>
                    <Col>
                        <Form.Control className="mb-2" type="number" min="0" 
                            value={editingProduct.price} onChange={(e) => handleNumberChange(e, 'price', true)} />
                    </Col>
                    <Col>
                        <Form.Control className="mb-2" type="number" min="0" 
                            value={editingProduct.stock} onChange={(e) => handleNumberChange(e, 'stock', true)} />
                    </Col>
                </Row>
                <Form.Control className="mb-2" as="textarea" value={editingProduct.description} onChange={(e: any) => setEditingProduct({...editingProduct, description: e.target.value})} />
                
                {/* תמונה מוצר */}
                <div className="mb-2">
                    <Form.Label>תמונה נוכחית:</Form.Label>
                    <div className="mb-2 d-flex align-items-center gap-2">
                         <Form.Control value={editingProduct.imageUrl || ''} disabled readOnly style={{backgroundColor: '#f8f9fa'}} />
                         {editingProduct.imageUrl && <Image src={editingProduct.imageUrl} style={{width: 40, height: 40, objectFit: 'cover'}} rounded />}
                    </div>
                </div>
                
                <Form.Group className="mb-2">
                    <Form.Label>החלף תמונה (אופציונלי):</Form.Label>
                    <Form.Control type="file" onChange={(e: any) => setEditingFile(e.target.files[0])} />
                </Form.Group>

            </Form>}
        </Modal.Body>
        <Modal.Footer><Button onClick={handleSaveChanges}>שמור שינויים</Button></Modal.Footer>
      </Modal>

    </Container>
  );
}