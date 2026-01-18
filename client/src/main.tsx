import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
// ייבוא העיצוב של בוטסטראפ לכל האפליקציה
import 'bootstrap/dist/css/bootstrap.min.css'; 

import { Provider } from 'react-redux';
import { store } from './features/store';


// יצירת האלמנט הראשי של ריאקט
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);