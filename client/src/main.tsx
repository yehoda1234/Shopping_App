// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
// import { BrowserRouter } from 'react-router-dom';
// // ייבוא העיצוב של בוטסטראפ לכל האפליקציה
// import 'bootstrap/dist/css/bootstrap.min.css'; 

// import { Provider } from 'react-redux';
// import { store } from './features/store';


// // יצירת האלמנט הראשי של ריאקט
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <Provider store={store}>
//     <BrowserRouter>
//     <App />
//     </BrowserRouter>
//     </Provider>
//   </React.StrictMode>,
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from 'react-redux';
import { store } from './features/store';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          rtl={true}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
