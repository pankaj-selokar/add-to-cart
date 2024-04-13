// import React from 'react';
// import { Button, Card, CardContent, Typography } from '@mui/material';

// const ProductCard = ({ product, onAddToCart }) => {
//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5" component="div">
//           {product.name}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {product.description}
//         </Typography>
//         <Typography variant="h6" color="text.secondary">
//           Price: ${product.price}
//         </Typography>
//       </CardContent>
//       <Button onClick={() => onAddToCart(product)} variant="contained" color="primary">
//         Add to Cart
//       </Button>
//     </Card>
//   );
// };

// export default ProductCard;

import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const onAddToCart = async (product) => {
    try {
      // Make an HTTP POST request to the /cart endpoint with the product data
      const response = await axios.post('http://localhost:5000/cart', product);
      if (response.status === 200) {
        console.log('Product added to cart successfully');
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Price: ${product.price}
        </Typography>
      </CardContent>
      <Button onClick={() => onAddToCart(product)} variant="contained" color="primary">
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
