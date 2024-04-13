import React, { useEffect, useState } from 'react';
import { Grid, Container, IconButton } from '@mui/material';
import ProductCard from './ProductCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Cart from './Cart';
import axios from 'axios';
import { Link } from 'react-router-dom';


const LandingPage = ({products, setProducts}) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async() => {
      try{
        const response = await fetch('http://localhost:5000/products');
        if(response.ok){
          const data = await response.json();
          setProducts(data);
        }else {
          console.error('Failed to fetch product data');
        }
      }
      catch(error){
        console.log('Error fetching product data:',error);
      }
    }
    fetchProducts();
  },[setProducts]);

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post('http://localhost:5000/cart', product);
      if (response.status === 200) {
        console.log('Product added to cart successfully');
        setShowCart(true); // Optionally, you can redirect to the cart page after adding the product to the cart
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <Container>
      <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
      <IconButton  sx={{ position: 'absolute', top: '10px', right: '10px' }}>
        <ShoppingCartIcon />
      </IconButton>
      </Link>
      {!showCart ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Cart cartItems={cartItems} />
      )}
    </Container>
  );
};

export default LandingPage;
