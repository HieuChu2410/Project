import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });

      if (response.data.success) {
        setTimeout(() => {
          navigate("/myorders");
        }, 2000);
      } else {
        setError("Payment verification failed");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Error verifying payment");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (success && orderId) {
      verifyPayment();
    } else {
      setError("Invalid payment session");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, []);

  return (
    <div className="verify">
      {verifying ? (
        <div className="spinner"></div>
      ) : (
        <div className="verification-result">
          {error ? (
            <div className="error-message">
              <h3>Payment Failed</h3>
              <p>{error}</p>
              <p>Redirecting to home...</p>
            </div>
          ) : (
            <div className="success-message">
              <h3>Payment Successful!</h3>
              <p>Your order has been confirmed.</p>
              <p>Redirecting to orders...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verify;
