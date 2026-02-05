import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Badge, Card, Row, Col, Button } from 'react-bootstrap';
import { ordersService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BoxSeam, Calendar3, CashCoin } from 'react-bootstrap-icons';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const getStatusText = (status: string) => {
    switch(status) {
        case 'PENDING': return 'PENDING';
        case 'SHIPPED': return 'SHIPPED';
        case 'DELIVERED': return 'DELIVERED';
        case 'CANCELLED': return 'CANCELLED';
        default: return status;
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary"/></div>;

  if (orders.length === 0) {
      return (
          <Container className="text-center mt-5">
              <h3>אין לך עדיין הזמנות 🤷‍♂️</h3>
              <Button variant="primary" onClick={() => navigate('/store')}>התחל לקנות</Button>
          </Container>
      );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">ההזמנות שלי 📦</h2>

      {/* תצוגה למחשב (Desktop) - טבלה רגילה */}
    
      <div className="d-none d-md-block"> 
        <div className="bg-white rounded shadow-sm overflow-hidden">
            <Table hover className="mb-0 align-middle">
            <thead className="bg-light">
                <tr>
                <th className="py-3">מספר הזמנה</th>
                <th>תאריך</th>
                <th>פריטים</th>
                <th>סה"כ לתשלום</th>
                <th>סטטוס</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                <tr key={order.id}>
                    <td className="fw-bold">#{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                        <small className="text-muted">
                            {order.items?.map((item: any) => 
                                `${item.product?.name} (x${item.quantity})`
                            ).join(', ')}
                        </small>
                    </td>
                    <td>₪{Number(order.totalAmount).toFixed(2)}</td>
                    <td>
                        <Badge bg={getStatusColor(order.status)} className="px-3 py-2 rounded-pill">
                            {getStatusText(order.status)}
                        </Badge>
                    </td>
                </tr>
                ))}
            </tbody>
            </Table>
        </div>
      </div>

      {/* תצוגה לנייד (Mobile) - כרטיסיות */}
      <div className="d-md-none">
          {orders.map((order) => (
              <Card key={order.id} className="mb-3 shadow-sm border-0">
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                      <span className="fw-bold">הזמנה #{order.id}</span>
                      <Badge bg={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  </Card.Header>
                  <Card.Body>
                      <Row className="mb-3 g-2">
                          <Col xs={6}>
                              <div className="text-muted small"><Calendar3 className="me-1"/> תאריך</div>
                              <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </Col>
                          <Col xs={6}>
                              <div className="text-muted small"><CashCoin className="me-1"/> סה"כ</div>
                              <div className="fw-bold text-primary">₪{Number(order.totalAmount).toFixed(2)}</div>
                          </Col>
                      </Row>
                      
                      <div className="bg-light p-2 rounded">
                          <div className="text-muted small mb-1"><BoxSeam className="me-1"/> פריטים:</div>
                          <ul className="list-unstyled mb-0 small">
                            {order.items?.map((item: any, idx: number) => (
                                <li key={idx} className="d-flex justify-content-between">
                                    <span>{item.product?.name}</span>
                                    <span className="text-muted">x{item.quantity}</span>
                                </li>
                            ))}
                          </ul>
                      </div>
                  </Card.Body>
              </Card>
          ))}
      </div>

    </Container>
  );
}