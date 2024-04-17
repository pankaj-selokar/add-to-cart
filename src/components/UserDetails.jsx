import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UserDetails = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    contact: '',
    country:'',
    address: '',
    pincode: '',
    landmark: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({
    user_name: '',
    email: '',
    contact: '',
    country:'',
    address: '',
    pincode: ''
  });
  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [countryError, setCountryError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Reset error message when user types in a field
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // const errors = {};
    // // Check for empty fields
    // for (const key in formData) {
    //   if (key !== 'landmark' && !formData[key].trim()) {
    //     errors[key] = 'This field is required';
    //   }
    // }
    // // Check for valid email format
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (formData.email && !emailPattern.test(formData.email)) {
    //   errors.email = 'Please enter a valid email address';
    // }
    // // Update form errors state
    // setFormErrors(errors);
    // // If there are errors, do not submit the form
    // if (Object.keys(errors).length > 0) {
    //   return;
    // }
    // // You can perform form submission logic here, like sending the data to the server
    // console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      user_name: '',
      email: '',
      contact: '',
      country:'',
      address: '',
      pincode: '',
      landmark: ''
    });
    setAgreeTerms(false);
    setFormSubmitted(false);
  };

  const handleFormSubmit = async () => {
    setFormSubmitted(true);
    let isError = false;
    if(formData.user_name.trim() === ''){
        setUserNameError('User name is required');
        isError = true;
    }else{
        setUserNameError('');
    }
    if(formData.email.trim() === ''){
        setEmailError('Email is required');
        isError = true;
    }else{
        setEmailError('');
    }
    if(formData.contact.trim() === ''){
        setContactNumberError('contact number is required');
        isError = true;
    }else{
        setContactNumberError('');
    }
    if(formData.country.trim() === ''){
        setCountryError('country is required');
        isError = true;
    }else{
        setCountryError('');
    }
    if(formData.address.trim() === ''){
        setAddressError('Address is required');
        isError = true;
    }else{
        setAddressError('');
    }
    if(formData.pincode.trim() === ''){
        setPincodeError('pincode is required');
        isError = true;
    }else{
        setPincodeError('');
    }
    if (isError) {
        console.error('Please fill all required fields');
        toast.error('Please fill required fields!');
        return;
      }
    
    try{
        const response = await axios.post('http://localhost:5000/user_details',formData ,{
            headers:{
                'Content-Type': 'application/json',
            }
        });
        console.log('response:',response);
        if (response.status === 200) {
            console.log('user details added successfully');
            toast.success('user details added successfully!');
            const updatedForm = { ...formData };
            console.log(updatedForm);
            setFormData({ user_name:'', email:'', contact:'', country:'', address:'', pincode:'', landmark:'' });
          } else {
            console.error('Failed to add product');
          }
    }
    catch(error){
        console.log('Error adding user details: ', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        User Details Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="User Name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              error={Boolean(userNameError)}
              helperText={userNameError}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(emailError)}
              helperText={emailError}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Number"
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              error={Boolean(contactNumberError)}
              helperText={contactNumberError}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              error={Boolean(countryError)}
              helperText={countryError}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={4}
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={Boolean(addressError)}
              helperText={addressError}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              error={Boolean(pincodeError)}
              helperText={pincodeError}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={agreeTerms} onChange={handleCheckboxChange} />}
              label="I agree to the Terms and Conditions"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" onClick={handleFormSubmit}
             variant="contained" color="primary" disabled={!agreeTerms}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default UserDetails;
