import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import type { Product, Category } from '../types/product'; 
import { productsService, categoriesService } from '../services/api'; 
import ProductCard from '../components/ProductCard';
import { Search } from 'react-bootstrap-icons'; 

export default function Store() {
  // נתונים גולמיים מהשרת
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); 
  
  // נתונים לסינון ותצוגה
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // סטייטים למצב טעינה ושגיאות
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. טעינה ראשונית של הכל (מוצרים + קטגוריות)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
            productsService.getAll(),
            categoriesService.getAll()
        ]);


        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData); 

      } catch (err) {
        setError('לא הצלחנו לטעון את החנות. נסה שוב מאוחר יותר.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. מנוע הסינון - רץ אוטומטית כשמשנים חיפוש או קטגוריה
  useEffect(() => {
    let result = products;

    if (selectedCategoryId !== '') {
        result = result.filter(p => p.category?.id === Number(selectedCategoryId));
    }

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.description.toLowerCase().includes(term)
        );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategoryId, products]);


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
      <div className="text-center mb-5">
          <h2 className="mb-2 fw-bold">המוצרים שלנו ✨</h2>
          <p className="text-muted">איכות ושירות מעל הכל</p>
      </div>

      {/* --- סרגל חיפוש וסינון --- */}
      <div className="bg-light p-4 rounded shadow-sm mb-5 border">
        <Row className="g-3 align-items-center">
            {/* בחירת קטגוריה */}
            <Col md={4}>
                <Form.Select 
                    value={selectedCategoryId} 
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="border-secondary bg-white"
                    style={{ cursor: 'pointer' }}
                >
                    <option value="">כל הקטגוריות</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </Form.Select>
            </Col>

            <Col md={8}>
                <InputGroup>
                    <InputGroup.Text className="bg-white border-end-0"><Search className="text-muted"/></InputGroup.Text>
                    <Form.Control 
                        placeholder="חפש מוצר..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-start-0"
                    />
                </InputGroup>
            </Col>
        </Row>
      </div>
      
      {/* --- רשימת המוצרים המסוננת --- */}
      <Row>
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      
      {filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <h4 className="text-muted">לא נמצאו מוצרים 😕</h4>
            <p className="text-secondary">נסה לשנות את הקטגוריה או את מילות החיפוש</p>
            <button 
                className="btn btn-link text-decoration-none" 
                onClick={() => {setSearchTerm(''); setSelectedCategoryId('');}}
            >
                נקה סינון
            </button>
          </div>
      )}
    </Container>
  );
}