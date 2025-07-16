import React from "react";
import axios from "axios";

const GoPremiumButton = ({ userId }) => {
  const handlePayment = async () => {
    try {
      // 1. Create Razorpay order
      const { data } = await axios.post(
        "https://your-tube-4yf7.onrender.com/user/create-order"
      );

      const options = {
        key: "rzp_test_CXGzBsZFihgCm1", // ✅ RAZORPAY_KEY_ID (public)
        amount: data.amount,
        currency: data.currency,
        name: "YourTube Premium",
        description: "Upgrade to Premium",
        order_id: data.orderId,
        handler: async function (response) {
          // 2. Verify payment
          await axios.post("https://your-tube-4yf7.onrender.com/user/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId,
          });

          alert("Payment successful! Premium activated.");
        },
        prefill: {
          name: "Vashu Singh",
          email: "vashu@gmail.com",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Something went wrong during payment.");
    }
  };

  return (
    <button
      style={{
        backgroundColor: "black",
        color: "white",
        border: "white 1px solid",
        padding: "10px 20px",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "16px",
        fontWeight: "bold",
      }}
      onClick={handlePayment}
    >
      Go Premium
    </button>
  );
};

export default GoPremiumButton;
