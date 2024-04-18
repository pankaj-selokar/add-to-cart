const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id:'rzp_test_9sk0KuKuUpCTKM',
  key_secret:'VbsRcp3d8lD5Bl6rWf4xnLR4'
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vowelsweb'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve standard.html file
app.get('/standard', (req, res) => {
  res.sendFile(path.join(__dirname, 'standard.html'));
});

app.post('/create/orderId', (req, res) => {
  console.log("create orderId request",req.body);
  var options = {
    amount: req.body.amount,
    currency: 'INR',
    receipt: 'rcp1'
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
    res.send({orderId: order.id});
  });
});

app.post('/api/payment/verify', (req, res) => {
  let body = req.body.response.razorpay_order_id +"|" + req.body.response.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('sha256', 'VbsRcp3d8lD5Bl6rWf4xnLR4')
    .update(body.toString())
    .digest('hex');
    console.log('sig received',req.body.response.razorpay_signature)
    console.log('sig generated',expectedSignature);
  var response = {'signatureIsValid':false}
  if(expectedSignature === req.body.response.razorpay_signature)
    response = {'signatureIsValid':true}
      res.send(response);
});

// Define a route
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products_table';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products from database: ', err);
      res.status(500).json({ error: 'Error fetching products from database' });
    } else {
      console.log('Products fetched successfully');
      res.status(200).json(results); // Return products as JSON response
    }
  });
});

// Define a route to handle the POST request to add a new product
app.post('/products', (req, res) => {
  const {
    name,
    description,
    price,
    quantity
  } = req.body;

  const imageUrl = '';

  // Perform the database insertion
  const sql = 'INSERT INTO products_table (name, description, price, image_url, quantity_available, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const currentTime = new Date().toISOString();
  const values = [name, description, price, imageUrl, quantity, currentTime, currentTime];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting product into database: ', err);
      res.status(500).json({ error: 'Error inserting product into database' });
    } else {
      console.log('Product added successfully');
      res.status(200).json({ message: 'Product added successfully' });
    }
  });
});

app.post('/user_details', (req, res) => {
  const {
    user_name,
    email,
    contact,
    country,
    address,
    pincode,
    landmark,

  } = req.body;
  console.log(req.body);
  const sql = 'INSERT INTO user_details (user_name, email, contact, country, address, pincode, landmark) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const currentTime = new Date().toISOString();
  const values = [user_name, email, contact, country, address, pincode, landmark];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user details into database: ', err);
      res.status(500).json({ error: 'Error inserting user details into database' });
    } else {
      console.log('User added successfully');
      res.status(200).json({ message: 'User added successfully' });
    }
  });
});

app.post('/users', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    userName,

  } = req.body;
  console.log(req.body);
  const sql = 'INSERT INTO users (firstName, lastName, email, password, userName) VALUES (?, ?, ?, ?, ?)';
  const values = [firstName, lastName, email, password, userName];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user details into database: ', err);
      res.status(500).json({ error: 'Error inserting user details into database' });
    } else {
      console.log('User added successfully');
      res.status(200).json({ message: 'User added successfully' });
    }
  });
});

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving user details from database: ', err);
      res.status(500).json({ error: 'Error retrieving user details from database' });
    } else {
      console.log('User details retrieved successfully');
      res.status(200).json(results);
    }
  });
});

app.delete('/products/:product_id', (req, res) => {
  const productId = req.params.product_id; // Get the productId from URL parameters
  // Perform the database deletion
  const sql = 'DELETE FROM products_table WHERE product_id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product from database: ', err);
      res.status(500).json({ error: 'Error deleting product from database' });
    } else {
      console.log('Product deleted successfully');
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  });
});


app.put('/products/:product_id', (req, res) => {
  const productId = req.params.product_id; // Extract product ID from URL parameter
  const { name, description, price, quantity_available } = req.body; // Updated product data
  const sql = `UPDATE products_table SET name = ?, description = ?, price = ?, quantity_available = ? WHERE product_id = ?`;

  const values = [name, description, price, quantity_available, productId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Error updating product' });
    } else {
      console.log('Product updated successfully');
      res.status(200).json({ message: 'Product updated successfully' });
    }
  });

});

app.post('/cart', (req, res) => {
  const {
    product_id,
    name,
    description,
    price,
    quantity_available
  } = req.body;
  console.log(req.body);

  const sql = 'INSERT INTO cart_items (product_id, name, description, price, quantity_available) VALUES (?, ?, ?, ?, ?)';
  const values = [product_id, name, description, price, quantity_available];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding product to cart:', err);
      res.status(500).json({ error: 'Error adding product to cart' });
    } else {
      console.log('Product added to cart successfully');
      res.status(200).json({ message: 'Product added to cart successfully' });
    }
  });
});

app.get('/cart', (req, res) => {
  const sql = 'SELECT * FROM cart_items';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products from database: ', err);
      res.status(500).json({ error: 'Error fetching products from database' });
    } else {
      console.log('Products fetched successfully');
      res.status(200).json(results); // Return products as JSON response
    }
  });
});

app.delete('/cart/:cart_id',(req, res) => {
  const cartId = req.params.cart_id;
  const sql = 'DELETE FROM cart_items WHERE cart_id = ?';
  db.query(sql, [cartId], (err, result) => {
    if (err) {
      console.error('Error deleting product from database: ', err);
      res.status(500).json({ error: 'Error deleting product from database' });
    } else {
      console.log('Product deleted successfully');
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
