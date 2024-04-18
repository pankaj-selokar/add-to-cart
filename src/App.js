// App. 
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Cart from './components/Cart';
import Admin from './components/Admin';
import UserDetails from './components/UserDetails';
import { ToastContainer} from 'react-toastify';
import Login  from './components/Login';
import Signup from './components/Signup';
import Standard from './components/Standard';

function App() {
  
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  // Function to adjust the quantity of an item in the cart
  const adjustQuantity = (itemId, amount) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        const updatedQuantity = item.quantity + amount;
        // Ensure the quantity is not negative
        const newQuantity = updatedQuantity < 0 ? 0 : updatedQuantity;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  return (
    <div>
    
    
    <Router>
    <ToastContainer></ToastContainer>
      <Routes>
      <Route path='/' element={<LandingPage products={products} setProducts={setProducts}/>}/>
      <Route path='/cart' element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} adjustQuantity={adjustQuantity} />}/>
      <Route path='/admin' element={<Admin products={products} setProducts={setProducts} />} />
      <Route path='/user_details' element={ <UserDetails/>} />
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/standard_payment' element={<Standard/>}></Route>
      </Routes>      
    </Router>
    
    </div>
  );
}

export default App;
