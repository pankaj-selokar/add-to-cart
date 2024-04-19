import React, { useEffect, useState } from 'react';
import { Card, CardContent, TextField, Button, Stack, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [userNameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(0);

    const cardStyle = {
        width: '24rem',
        background: 'white',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
        border: '2px solid #ddd',
        borderRadius: '8px',
    };

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            // Set the logged-in user state if it exists in local storage
            setUsername(loggedInUser);
        }
        
    }, [])

    const handleLogin = async () => {

        if (username.trim() === '' && password.trim() === '') {
            toast.error('Username and password cannot be empty!');
            setUsernameError(true);
            setPasswordError(true);
            return;
        }

        // Username validation
        if (!validateUserName(username)) {
            setUsernameError(true);
            return;
        }
        setUsernameError(false);

         // Password validation
        if (password.trim() === '') {
            setPasswordError(true);
            toast.error('Password cannot be empty!');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/users?userName=${username}`);
            const userData = response.data;
            console.log(userData);
            if (userData.length > 0) {
                // Username exists
                const user = userData[0]; // Assume username is unique
                console.log(user.password+" "+password);
                if (user.password === password) {
                    // Password matches
                    localStorage.setItem('loggedInUser', username);
                    setUsername('');
                    setPassword('');
                    toast.success('Login successful');
                    if(username === 'pankajselokar'){
                        navigate('/admin');
                    }else{
                        navigate('/home');
                    }
                    
                } else {
                        if(password===''){
                            setPasswordError(true);
                            toast.error('password can not be empty!');
                        }
                        else{
                        toast.error('Invalid password!, try again');
                    }
                }
            } else {
                // Username does not exist
                setUsernameExists(false);
                toast.error('Username not exists');
            }
        } catch (error) {
            console.error('Error checking username:', error);
            toast.error('An error occurred while checking username');
        }
    };

    const validateUserName = (username) => {
        if (username === '') {
            toast.error('username cannot be empty!');
            return false;
        }
        const regex = /^[a-zA-Z0-9]+$/; // Allows only letters and numbers
        return regex.test(username);
    };

    const handleUsernameBlur = async () => {
        if (!validateUserName(username)) {
            setUsernameError(true);
            // toast.error('Invalid username format');
            return;
        }
        setUsernameError(false);

        try {
            const response = await axios.get(`http://localhost:5000/users?userName=${username}`);
            const userData = response.data;

            if (userData.length > 0) {
                // Username exists
                setUsernameExists(true);

            } else {
                // Username does not exist
                setUsernameExists(false);
                toast.error('Username not exists');
            }
        } catch (error) {
            console.error('Error checking username:', error);
            toast.error('An error occurred while checking username');
        }
    };

    // const blockUsername = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8000/users?userName=${username}`);
    //         const userData = response.data;

    //         if(userData.length > 0) {
    //             const user = userData[0];
    //             await axios.post(`http://localhost:5000/blockUser/`, { id: user.id, userName: user.userName });
    //             // setBlockedUsers(prevBlockedUsers => [...prevBlockedUsers, { id: user.id, userName: user.userName }]);
    //             toast.error('Your account has been blocked due to multiple unsuccessful login attempts.');
    //         } else {
    //             toast.error('User not found');
    //         }
            
    //     } catch (error) {
    //         console.error('Error blocking username:', error);
    //         toast.error('An error occurred while blocking the username');
    //     }
    // };

    // const handleBlockedUserNavigation = (blockedUsername) => {
    //     navigate('/home', { state: { blockedUser: username } });
    // };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Card className="draggable-card" style={cardStyle}>
                <CardContent>
                    <h2>Login</h2>
                    <TextField
                        type="text"
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={handleUsernameBlur}
                        error={userNameError}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    edge="end"
                                    aria-label="username-exists"
                                    onClick={handleUsernameBlur}
                                    style={{ visibility: usernameExists ? 'visible' : 'hidden' }} // Show/hide the icon based on username existence
                                >
                                    <CheckCircle style={{ color: 'green' }} /> {/* Green checkmark icon */}
                                </IconButton>
                            ),
                        }}
                        helperText={userNameError ? 'username cannot be empty' : ''}
                    />
                    <TextField
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </Button>
                            ),
                        }}
                        error={passwordError}
                        helperText={passwordError ? 'password cannot be empty' : ''}
                    />
                    <Stack direction="row" spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
                        <Button variant="contained" color="primary" onClick={handleLogin}>
                            Login
                        </Button>
                        <Link to="/signup"><Button variant="contained" color="error">+ Signup</Button></Link>
                        <Link to="/forget-password">Forgot Password?</Link>
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
