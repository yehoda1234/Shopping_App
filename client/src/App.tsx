import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// רכיבים ודפים
import MainNavbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Store from './pages/Store';
import Register from './pages/Register';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AuthCallback from './pages/AuthCallback';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';

// Redux Hooks
import { useAppDispatch, useAppSelector } from './features/hooks';
import { fetchCart } from './features/cart/cartSlice';

function App() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <MainNavbar />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          
          {/* 👇 הנתיב החדש לדף המוצר 👇 */}
          <Route path="/product/:id" element={<ProductDetails />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <NotFound />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      <footer className="bg-white text-center py-3 mt-4 border-top shadow-sm">
        <Container>
          <small className="text-muted">© 2026 כל הזכויות שמורות לחנות שלי</small>
        </Container>
      </footer>

      <CartDrawer />
    </div>
  );
}

export default App;