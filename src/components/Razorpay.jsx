// import React, { useEffect } from "react";
// import useRazorpay from "./useRazorpay";

// const Razorpay = () => {
//   const [Razorpay, isLoaded] = useRazorpay();

//   useEffect(() => {
//     if (isLoaded) {
//       const options = {
//         key: "rzp_test_9sk0KuKuUpCTKM",
//         amount: "50000", // amount in paise (50 INR)
//         currency: "INR",
//         name: "Acme Corp",
//         description: "Test payment",
//         handler: function (response) {
//           alert(response.razorpay_payment_id);
//         },
//       };

//       const razorpay = new Razorpay();
//       razorpay.initialize(options);
//     }
//   }, [Razorpay, isLoaded]);

//   const handlePayment = () => {
//     if (isLoaded) {
//       const razorpay = new Razorpay();
//       razorpay.open();
//     } else {
//       console.log("Razorpay script not loaded yet.");
//     }
//   };

//   return (
//     <div>
//       <button onClick={handlePayment}>Pay with Razorpay</button>
//     </div>
//   );
// };

// export default Razorpay;

import { useCallback, useEffect } from "react";
import useRazorpay from "react-razorpay";

export default function App() {
  const [Razorpay, isLoaded] = useRazorpay();

  const createOrder = async () => {
    // Generate a random order ID (replace with your actual logic)
    const orderId = Math.floor(Math.random() * 1000000).toString();
    
    // Simulate a delay to mimic API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    return { id: orderId };
  };

  const handlePayment = useCallback(async () => {
    const order = await createOrder();

    const options = {
      key: "rzp_test_9sk0KuKuUpCTKM",
      amount: "3000",
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: (res) => {
        console.log(res);
      },
      prefill: {
        name: "Pankaj Selokar",
        email: "pankajselokar@yahoo.com",
        contact: "8208064621",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay]);

  useEffect(() => {
    if (isLoaded) {
      handlePayment();
    }
  }, [isLoaded, handlePayment])

  return (
    <div className="App">
      <button onClick={handlePayment}>Click</button>
    </div>
  );
}
