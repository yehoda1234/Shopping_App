// import { Container } from "react-bootstrap";
// import MainNavbar from "./components/Navbar";
// import { Routes, Route } from "react-router-dom";
// import Store from "./pages/Store";



// function App() {
//   return (
//     <div className="d-flex flex-column min-vh-100 bg-light">

//        <MainNavbar />
//       <main className="flex-grow-1">
//         <Routes>
//           <Route path="/" element={<Store />} />
//           <Route path="/store" element={<Store />} />
//         </Routes>
//         <Container>
//           <h1 className="text-center mt-5">ברוכים הבאים לחנות </h1>
//           <p className="text-center">זהו עמוד הבית של האפליקציה שלי.</p>
//         </Container>
//       </main>

//       <footer className="bg-light text-center py-3 mt-4 border-top">
//         <small className="text-muted">@ כל הזכויות שמורות 2026</small>
//       </footer>


//     </div>
//   );
// }

// export default App;








import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainNavbar from './components/Navbar';
import Store from './pages/Store';
import Register from './pages/Register';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import { Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from './features/hooks';
import { fetchCart } from './features/cart/cartSlice';

function App() {
  const dispatch = useAppDispatch();
  // בודקים האם המשתמש מחובר (נטען מה-LocalStorage ב-AuthSlice)
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // אם המשתמש מחובר - נטען את העגלה שלו מהשרת מיד!
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]); // ירוץ כל פעם שסטטוס ההתחברות משתנה

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <MainNavbar />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/store" element={<Store />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
          
  