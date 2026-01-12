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








import { Routes, Route } from 'react-router-dom';
import MainNavbar from './components/Navbar';
import Store from './pages/Store';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* התפריט העליון - מופיע תמיד */}
      <MainNavbar />

      {/* אזור התוכן המשתנה */}
      <main className="flex-grow-1">
        <Routes>
          {/* כשנכנסים לדף הבית (/) או לחנות (/store) - מציגים את קומפוננטת החנות */}
          <Route path="/" element={<Store />} />
          <Route path="/store" element={<Store />} />
          
          {/* כאן נוסיף בעתיד דפים נוספים כמו עגלה ולוגין */}
        </Routes>
      </main>

      {/* פוטר תחתון - מופיע תמיד */}
      <footer className="bg-white text-center py-3 mt-4 border-top shadow-sm">
        <Container>
          <small className="text-muted">© 2026 כל הזכויות שמורות לחנות שלי</small>
        </Container>
      </footer>
    </div>
  );
}

export default App;
          
  