import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false); // Stop loading due to error
      return;
    }
  
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({ name, email, password });
  
      const res = await axios.post('https://levitation-backend-vz0r.onrender.com/api/auth/register', body, config);
  
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/'); // Redirect to login upon successful registration
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      const errMsg =
        err.response && err.response.data && err.response.data.errors
          ? err.response.data.errors.map(err => err.msg).join(', ')
          : 'An error occurred, please try again.';
      setError(errMsg);
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  };
  
  const navigateToLogin = () => {
    navigate("/"); // Make sure this route matches your route setup for the registration page
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto my-10">
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold">Register</h2>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Name"
          />
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
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            placeholder="Confirm Password"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
         {/* Message for new users */}
         <div className="mt-6 text-center">
          <p className="text-gray-600">Already Registered? Go to Login:</p>
          <button
            onClick={navigateToLogin}
            className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
