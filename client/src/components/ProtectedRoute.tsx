import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
  
    if (!token) {
      console.error("No token found in localStorage.");
      navigate("/login"); // Redirect to login if no token is found
      return;
    }

    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format.");
      }

      const decoded = JSON.parse(atob(tokenParts[1])); // Decode the payload
     

      if (!allowedRoles.includes(decoded.role)) {
        console.error("User role not allowed:", decoded.role);
        navigate("/login"); // Redirect if the user's role is not allowed
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      navigate("/login"); // Redirect if token decoding fails
    }
  }, [navigate, token, allowedRoles]);

  if (!token) {
    return null; // Prevent rendering until validation is complete
  }

  return <>{children}</>;
};

export default ProtectedRoute;