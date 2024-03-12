import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true); // Start loading
  
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setError("Please enter a valid email address.");
        setLoading(false); // Stop loading
        return;
      }
  
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const body = JSON.stringify({ email, password });
  
        const res = await axios.post(
          "https://levitation-backend-vz0r.onrender.com/api/auth/login",
          body,
          config
        );
  
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", res.data.email);
          navigate("/add-products"); // Adjust this route as needed
        } else {
          setError("Failed to login. Please try again.");
        }
      } catch (err) {
        const errMsg = err.response?.data?.errors?.map(e => e.msg).join(" ") || err.response?.data?.error || "An error occurred during login. Please try again later.";
        setError(errMsg);
      } finally {
        setLoading(false); // Stop loading regardless of the outcome
      }
  };
  
  const navigateToRegister = () => {
    navigate("/register"); // Make sure this route matches your route setup for the registration page
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto my-10">
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Email"
          />
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700"
            disabled={loading} 
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Message for new users */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">New user? Go to registration:</p>
          <button
            onClick={navigateToRegister}
            className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
