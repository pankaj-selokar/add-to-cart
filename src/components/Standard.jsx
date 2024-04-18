import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TeaFactory = () => {
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const response = await fetch("/create/orderId", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount: "52900"
                    })
                });
                const data = await response.json();
                setOrderId(data.orderId);
            } catch (error) {
                console.error("Error fetching order ID:", error);
            }
        };

        fetchOrderId();
    }, []);

    const handlePayment = () => {
        const options = {
            key: "rzp_test_9sk0KuKuUpCTKM",
            amount: "3000",
            currency: "INR",
            name: "Vowels Web Cart",
            description: "Cart Items",
            image: "https://example.com/your_logo",
            order_id: orderId,
            handler: (response) => {
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signiture);
                console.log(response);
                const settings = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ response })
                };
                fetch("/create/orderId", settings)
                    .then(res => res.json())
                    .then(data => alert(JSON.stringify(data)))
                    .catch(error => console.error("Error processing payment:", error));
            },
            theme: {
                color: "#99cc33"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", (response) => {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        rzp1.open();
    };

    return (
        <div>
            <h1>Welcome to TeaFactory</h1>
            <h4>Buy Ooty Green Tea</h4>
            <img src="https://images.pexels.com/photos/1581484/pexels-photo-1581484.jpeg" width="400" alt="Ooty Green Tea" />
            <p>Your senses with green tea grow on the<br />foothills of the Nalgiris.</p>
            <h4>INR 339 for 250 gms</h4>
            <Button id="rzp-button1" 
             onClick={handlePayment}>Pay
            </Button>

        </div>
    );
};

export default TeaFactory;
