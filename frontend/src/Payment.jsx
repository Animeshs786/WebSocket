// import React, { useState } from "react";
// import axios from "axios";

// const Payment = () => {
//   const [order, setOrder] = useState(null);

//   const createOrder = async () => {
//     try {
//       const { data } = await axios.post(
//         "http://localhost:4008/api/user/transaction",
//         {
//           item: "666aeb0dc90f7ec6c6527afb",
//           onModel: "Course",
//           price: 1000,
//         },
//         {
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2U2NzczMWRjZDIzZDNiMmI1ZDI5OSIsImlhdCI6MTcxOTU2MDI5NiwiZXhwIjoxNzI0NzQ0Mjk2fQ.ppp28P4DHMkrl4MRJ4tQ0or5MkRNcRe_6_2E4SbKDa0`,
//           },
//         }
//       );
//       setOrder(data.order);
//       return data.order;
//     } catch (error) {
//       console.error("Error creating order:", error);
//     }
//   };

//   const handlePayment = async () => {
//     const order = await createOrder();

//     if (!order) {
//       alert("Failed to create order");
//       return;
//     }

//     const options = {
//       key: "rzp_test_J0b6bXmWMkyfkF",
//       amount: order.amount,
//       currency: order.currency,
//       name: "Your Company Name",
//       description: "Test Transaction",
//       image: "/your_logo.png",
//       order_id: order.id,
//       handler: async (response) => {
//         const paymentData = {
//           razorpayOrderId: response.razorpay_order_id,
//           razorpayPaymentId: response.razorpay_payment_id,
//           razorpaySignature: response.razorpay_signature,
//         };
//            console.log(paymentData,"paymentdata");
//         try {
//           const { data } = await axios.post(
//             "http://localhost:4008/api/user/verifyPayment",
//             paymentData
//           );
//           if (data.success) {
//             alert("Payment verified successfully!");
//           } else {
//             alert("Payment verification failed!");
//           }
//         } catch (error) {
//           console.error("Payment verification error:", error);
//           alert("Payment verification failed!");
//         }
//       },
//       prefill: {
//         name: "Your Name",
//         email: "your.email@example.com",
//         contact: "9999999999",
//       },
//       notes: {
//         address: "Your Address",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//       modal: {
//         ondismiss: async () => {
//           // Handle payment failure
//           await axios.post("http://localhost:4008/api/user/verifyPayment", {
//             razorpayOrderId: order.id,
//             razorpayPaymentId: null,
//             razorpaySignature: null,
//           });
//           alert("Payment failed or cancelled");
//         },
//       },
//     };

//     const rzp1 = new window.Razorpay(options);
//     rzp1.open();
//   };

//   return (
//     <div>
//       <button onClick={handlePayment}>Pay Now</button>
//     </div>
//   );
// };

// export default Payment;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Payment = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set a first-party cookie with SameSite attribute
    Cookies.set("session", "value", { sameSite: "Lax" });
  }, []);

  const createOrder = async () => {
    try {
      const { data } = await axios.post(
        "http://206.189.136.222:4008/api/user/transaction",
        {
          item: "666aeb0dc90f7ec6c6527afb",
          onModel: "Course",
          price: 1,
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2U2NzczMWRjZDIzZDNiMmI1ZDI5OSIsImlhdCI6MTcxOTU2MDI5NiwiZXhwIjoxNzI0NzQ0Mjk2fQ.ppp28P4DHMkrl4MRJ4tQ0or5MkRNcRe_6_2E4SbKDa0`,
          },
        }
      );
      return data.order;
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order. Please try again.");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    const order = await createOrder();
    console.log(order,"order")

    if (!order) {
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_live_IVHoTkbXvtN0mU", // Ensure this is the correct live/test key
      amount: order.amount,
      currency: order.currency,
      name: "Your Company Name",
      description: "Test Transaction",
      image: "/your_logo.png",
      order_id: order.id,
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Your Address",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: () => {
          alert("Payment cancelled or failed.");
        },
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Payment;
