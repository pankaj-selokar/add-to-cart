// // import React, { useEffect, useState } from 'react';
// // import {Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Typography } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import AddIcon from '@mui/icons-material/Add';
// // import RemoveIcon from '@mui/icons-material/Remove';
// // import axios from 'axios';

// // const Cart = ({ cartItems, removeFromCart, adjustQuantity }) => {

// //     const [items, setItems] = useState(cartItems);


// //   const handleAdjustQuantity = (itemId, amount) => {
// //     const updatedItems = items.map(item => {
// //       if (item.id === itemId) {
// //         const newQuantity = Math.max(0, item.quantity + amount);
// //         return { ...item, quantity: newQuantity };
// //       }
// //       return item;
// //     });
// //     setItems(updatedItems);
// //     adjustQuantity(itemId, amount);
// //   };
// //   return (
// //     <Container>
// //     <div anchor="right" open={true}
// //         sx={{
// //         height: '100%',
// //         width: '100%',
// //         position: 'fixed',
// //         top: 0,
// //         left: 0,
// //       }}>
// //       <Typography variant="h6" align="center" >
// //         Cart
// //       </Typography>
// //       <Divider />
// //       <List>
// //         {cartItems.map((item, index) => (
// //           <ListItem key={index} sx={{ marginBottom: '10px' }}>
// //             <ListItemText primary={item.name} secondary={`$${item.price}`} />
// //             <ListItemSecondaryAction>
// //               <IconButton size="small" onClick={() => handleAdjustQuantity(item.id, -1)}>
// //                 <RemoveIcon />
// //               </IconButton>
// //               <span style={{ margin: '0 10px' }}>{item.quantity}</span>
// //               <IconButton size="small" onClick={() => handleAdjustQuantity(item.id, 1)}>
// //                 <AddIcon />
// //               </IconButton>
// //               <IconButton size="small" onClick={() => handleRemove(item.id)}>
// //                 <DeleteIcon />
// //               </IconButton>
// //             </ListItemSecondaryAction>
// //           </ListItem>
// // ))}
// //       </List>
// //       </div>
// //     </Container>
// //   );
// // };

// // export default Cart;


// import React, { useEffect, useState } from 'react';
// import { Container, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Typography } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import axios from 'axios';

// const Cart = ({ cartItems, removeFromCart, adjustQuantity }) => {
//     const [items, setItems] = useState(cartItems);
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/cart');
//                 console.log(response.data);
//                 if (response.status === 200) {
//                     setProducts(response.data);
//                 } else {
//                     console.error('Failed to fetch products');
//                 }
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             }
//         };
//         fetchProducts();
//     }, []);

//     const handleRemove = (itemId) => {
//         const updatedItems = items.filter(item => item.id !== itemId);
//         setItems(updatedItems);
//         removeFromCart(itemId);
//     };

//     const handleAdjustQuantity = (itemId, amount) => {
//         const updatedItems = items.map(item => {
//             if (item.id === itemId) {
//                 const newQuantity = Math.max(0, item.quantity + amount);
//                 return { ...item, quantity: newQuantity };
//             }
//             return item;
//         });
//         setItems(updatedItems);
//         adjustQuantity(itemId, amount);
//     };

//     return (
//         <Container>
//             <div anchor="right" open={true}
//                 sx={{
//                     height: '100%',
//                     width: '100%',
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                 }}>
//                 <Typography variant="h6" align="center">
//                     Cart
//                 </Typography>
//                 <Divider />
//                 <List>
//                     {items.map((item, index) => {
//                         const product = products.find(prod => prod.id === item.id); 
//                         return (
//                             <ListItem key={index} sx={{ marginBottom: '10px' }}>
//                                 <ListItemText primary={product.name} secondary={`$${product.price}`} />
//                                 <ListItemSecondaryAction>
//                                     <IconButton size="small" onClick={() => handleAdjustQuantity(item.id, -1)}>
//                                         <RemoveIcon />
//                                     </IconButton>
//                                     <span style={{ margin: '0 10px' }}>{item.quantity}</span>
//                                     <IconButton size="small" onClick={() => handleAdjustQuantity(item.id, 1)}>
//                                         <AddIcon />
//                                     </IconButton>
//                                     <IconButton size="small" onClick={() => handleRemove(item.id)}>
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </ListItemSecondaryAction>
//                             </ListItem>
//                         );
//                     })}
//                 </List>
//             </div>
//         </Container>
//     );
// };

// export default Cart;
import React, { useEffect, useState } from 'react';
import { Container, Typography, Divider, List, 
  ListItem, ListItemText, ListItemSecondaryAction, 
  IconButton, Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle,} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const Cart = ({ cartItems, removeFromCart, adjustQuantity }) => {
  const [items, setItems] = useState(cartItems);
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteCartId, setDeleteCartId] = useState(null);

  useEffect(() => {
    
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cart');
      console.log(response.data);
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    // Initialize product quantities when cart items change
    const quantities = {};
    cartItems.forEach(item => {
      quantities[item.product_id] = 1;
    });
    setProductQuantities(quantities);
  }, [cartItems]);

  const confirmDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/cart/${deleteCartId}`);
            console.log('test',deleteCartId);
            if (response.status === 200) {
                console.log('Item removed from cart:', deleteCartId);
                setOpenDeleteDialog(false);
                const updatedItems = items.filter(item => item.product_id !== deleteCartId);
                setItems(updatedItems);
                removeFromCart(deleteCartId);
                setProductQuantities(prevQuantities => {
                    const updatedQuantities = { ...prevQuantities };
                    delete updatedQuantities[deleteCartId];
                    return updatedQuantities;
                });
            } else {
                console.error('Failed to remove item from cart');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };
    const handleDelete = (id) => {
      setDeleteCartId(id);
      console.log(id);
      setOpenDeleteDialog(true);
    };
  
  const handleSubQuantity = (itemId) => {
    const newQuantity = Math.max(1, productQuantities[itemId] - 1);
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: newQuantity
    }));
  };

  const handleAddQuantity = (itemId) => {
    const newQuantity = (productQuantities[itemId] || 1) + 1;
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: newQuantity
    }));
  };
  return (
    <Container>
      <div anchor="right" open={true}
        sx={{
          height: '100%',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
        }}>
        <Typography variant="h6" align="center">
          Cart
        </Typography>
        <Divider />
        <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
        <List>
          {products.map((item, index) => (
            <ListItem key={index} sx={{ marginBottom: '10px' }}>
              <ListItemText primary={item.name} secondary={`$${item.price}`} />
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={() => handleSubQuantity(item.product_id)}>
                  <RemoveIcon />
                </IconButton>
                <span style={{ margin: '0 10px' }}>{productQuantities[item.product_id] || 1}</span>                                <IconButton size="small" onClick={() => handleAddQuantity(item.product_id)}>
                  <AddIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(item.cart_id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  );
};

export default Cart;
