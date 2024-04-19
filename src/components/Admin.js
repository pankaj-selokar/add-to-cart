import React, { useEffect, useState } from 'react';
import {
  Container, TextField, Button, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Paper,
  Grid,
  Box,
  Typography
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = ({ products, setProducts }) => {
  const [showCart, setShowCart] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '' });
  const [deleteProductId, setDeleteProductId] = useState(null); // Keep track of the product to be deleted
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editProductName, setEditProductName] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editQuantityAvailable, setQuantityAvailable] = useState('');

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        // console.log(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products: ', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    // Reset error message when user types in a field
    if (name === 'name') setNameError('');
    if (name === 'description') setDescriptionError('');
    if (name === 'price') setPriceError('');
    if (name === 'quantity') setQuantityError('');
  };

  const handleAddProduct = async () => {
    // Check if any of the fields are empty
    let isError = false;
    if (newProduct.name.trim() === '') {
      setNameError('Product name is required');
      isError = true;
    }
    if (newProduct.description.trim() === '') {
      setDescriptionError('Product description is required');
      isError = true;
    }
    if (newProduct.price.trim() === '') {
      setPriceError('Product price is required');
      isError = true;
    }
    if (newProduct.quantity.trim() === '') {
      setQuantityError('Available quantity is required');
      isError = true;
    }

    if (isError) {
      console.error('Please fill in all required fields');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/products', newProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Product added successfully');
        toast.success('Product added successfully!');
        fetchProducts();
        const updatedProduct = { ...newProduct };
        console.log(updatedProduct);
        setProducts((prevProducts) => [...prevProducts, updatedProduct]);
        setNewProduct({ name: '', description: '', price: '', quantity: '' });
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log('delete id:' + deleteProductId);

      const response = await axios.delete(`http://localhost:5000/products/${deleteProductId}`);
      if (response.status === 200) {
        setOpenDeleteDialog(false);
        console.log('Product deleted successfully');
        fetchProducts();
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  const handleDelete = (id) => {
    setDeleteProductId(id);
    setOpenDeleteDialog(true);
  };

  //----------------Handle Edit-------------------
  const handleEdit = (product) => {
    setEditProduct(product);
    setEditProductName(product.name);
    setEditProductDescription(product.description);
    setEditProductPrice(product.price);
    setQuantityAvailable(product.quantity_available);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditProduct(null);
    setOpenEditDialog(false);
  };

  const handleSubmitEdit = async () => {
    try {

      const updatedProduct = {
        ...editProduct,
        name: editProductName,
        description: editProductDescription,
        price: editProductPrice,
        quantity_available: editQuantityAvailable
      };
      const response = await axios.put(`http://localhost:5000/products/${editProduct.product_id}`, updatedProduct);
      if (response.status === 200) {
        console.log('Product updated successfully');
        setOpenEditDialog(false);
        fetchProducts();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product: ', error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prevEditProduct => ({
      ...prevEditProduct,
      [name]: value
    }));
  };

  return (
    <Container>
      {/* <IconButton onClick={toggleCart} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
        <ShoppingCartIcon />
      </IconButton> */}
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
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            value={editProductName}
            onChange={(e) => setEditProductName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Product Description"
            type="text"
            fullWidth
            value={editProductDescription}
            onChange={(e) => setEditProductDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            id="price"
            name="price"
            label="Product Price"
            type="number"
            fullWidth
            value={editProductPrice}
            onChange={(e) => setEditProductPrice(e.target.value)}

          />
          <TextField
            margin="dense"
            id="quantity"
            name="quantity"
            label="Available quantity"
            type="number"
            fullWidth
            value={editQuantityAvailable}
            onChange={(e) => setQuantityAvailable(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <>
        <Container sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Box sx={{ width: '100%'}}>
           
              <Typography sx={{mt:2}} variant="h5" display="block" fontWeight={700} gutterBottom  >
                Add Product Section
              </Typography>
            

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: 2 }}>
              <Grid item xs={6} >
                <TextField
                  name="name"
                  label="Product Name"
                  fullWidth
                  value={newProduct.name}
                  onChange={handleInputChange}
                  error={Boolean(nameError)}
                  helperText={nameError}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="description"
                  label="Product Description"
                  fullWidth
                  value={newProduct.description}
                  onChange={handleInputChange}
                  error={Boolean(descriptionError)}
                  helperText={descriptionError}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="price"
                  label="Product Price"
                  fullWidth
                  type="number"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  error={Boolean(priceError)}
                  helperText={priceError}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="quantity"
                  label="Available quantity"
                  fullWidth
                  type="number"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  error={Boolean(quantityError)}
                  helperText={quantityError}
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleAddProduct} >Add Product</Button>
          </Box>
        </Container>

        <Box sx={{
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',mt: 5, width: '100%', 
            borderRadius: '5px',border: '1px solid #ccc'
            }}
        >
          <TableContainer component={Paper}>
            <Table aria-label="product table">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="h6">Products List</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Product Id</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id} style={{ backgroundColor: index % 2 === 0 ? '#ede8e8' : 'inherit' }}>
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.quantity_available}</TableCell>
                    <TableCell>
                      {/* <Button onClick={() => {console.log(product.quantity,product.name);handleDelete(product.product_id)}}>Delete</Button> */}
                      <Button onClick={() => handleDelete(product.product_id)}>Delete</Button>

                      <Button onClick={() => handleEdit(product)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>

    </Container>
  );
};

export default Admin;
