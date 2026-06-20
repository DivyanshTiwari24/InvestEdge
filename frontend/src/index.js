import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './index.css';
import HomePage from './landing/home/HomePage';
import SupportPage from './landing/support/SupportPage';
import Products from './landing/products/MainPage';
import Navbar from './landing/Navbar';
import Footer from './landing/Footer';
import Notfound from './landing/Notfound';
import Pricing from './landing/home/Pricing';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Navbar/>
  <Routes>
    <Route path="/" element={<HomePage/>}/>
  
    <Route path="/products" element={<Products/>}/>
    <Route path="/pricing" element={<Pricing/>}/>
    <Route path="/support" element={<SupportPage/>}/>
    <Route path="*" element={<Notfound/>}/>
  </Routes>
   <Footer/>
  </BrowserRouter>
);


