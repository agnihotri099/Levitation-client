import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AddProductPage from './components/auth/AddProductPage';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/add-products" element={
          <ProtectedRoute>
            <AddProductPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
