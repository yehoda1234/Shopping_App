import { use, useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { ordersService } from '../services/api';
import { Link } from 'react-router-dom';


interface OrderItem {
    id: number;
    quantity: number;
    priceAtPurchase: number;
    product: { name: string; imageUrl?: string};
}


interface Order {
    id: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}


export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await ordersService.getMyOrders();
                setOrders(data);
            } catch (err) {
                console.error(err);
                setError('לא הצלחנו לטעון את ההזמנות');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

// פונקציה לבחירת צבע התגית לפי הסטטוס
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'SHIPPED': return 'info';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
     }
    };

    if (loading) return <div className='text-center mt-5'><Spinner animation='border' /></div>;
    if (error) return <Alert variant='danger' className='m-5'>{error}</Alert>;

    return (
       <Container className="py-5">
      <h2 className="mb-4">ההזמנות שלי 📦</h2>

      {orders.length === 0 ? (
        <div className="text-center">
            <p>עדיין לא ביצעת הזמנות.</p>
            <Button as={Link as any} to="/" variant="primary">התחל לקנות</Button>
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm bg-white">
          <thead className="bg-light">
            <tr>
              <th># מספר הזמנה</th>
              <th>תאריך</th>
              <th>סטטוס</th>
              <th>סה"כ לתשלום</th>
              <th>פריטים</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.toString().substring(0, 8)}...</td> {/* מציגים רק חלק מה-ID אם הוא ארוך */}
                <td>{new Date(order.createdAt).toLocaleDateString('he-IL')}</td>
                <td>
                    <Badge bg={getStatusBadge(order.status)}>{order.status}</Badge>
                </td>
                <td className="fw-bold">₪{Number(order.totalAmount).toFixed(2)}</td>
                <td>
                    <ul className="list-unstyled mb-0">
                        {order.items.map(item => (
                            <li key={item.id} className="text-muted small">
                                {item.quantity} x {item.product.name}
                            </li>
                        ))}
                    </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

