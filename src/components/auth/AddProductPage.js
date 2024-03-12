import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const [products, setProducts] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const [newProduct, setNewProduct] = useState({
    productName: '',
    productQty: '',
    productRate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);


  const generatePDF = async () => {
    const username = localStorage.getItem('username');

    try {
        const response = await axios.get(`https://levitation-backend-vz0r.onrender.com/api/auth/generate-pdf/${username}`, { responseType: 'blob' });
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        
        setPdfUrl(fileURL);
        setPdfGenerated(true); // Indicate that the PDF has been generated
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};


  const fetchProducts = async () => {
    // Retrieve the username, assuming it's stored in localStorage
    const username = localStorage.getItem('username');
    console.log(username);
    try {
      // Now using the correct backend route for fetching products by username
      const response = await axios.get(`https://levitation-backend-vz0r.onrender.com/api/auth/products/${username}`);
      
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
};


  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    
    // Retrieve the username, assuming it's stored in localStorage
    const username = localStorage.getItem('username');
    
    const productDetails = {
      username, // Include username in the request body
      productName: newProduct.productName,
      productQty: Number(newProduct.productQty),
      productRate: Number(newProduct.productRate),
      productTotal: Number(newProduct.productQty) * Number(newProduct.productRate),
      productGST: (Number(newProduct.productQty) * Number(newProduct.productRate)) * 0.18,
    };
  
    try {
      // Use the correct endpoint as defined in your backend
      await axios.post(`https://levitation-backend-vz0r.onrender.com/api/auth/products/add`, productDetails);
      fetchProducts(); // Refresh the list
      setNewProduct({ productName: '', productQty: '', productRate: '' }); // Reset the form
      setPdfGenerated(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
};

  

const deleteProduct = async (productId) => {
  const username = localStorage.getItem('username');

  try {
    // Send the DELETE request with the productId and include username in the query string
    await axios.delete(`https://levitation-backend-vz0r.onrender.com/api/auth/products/${productId}?username=${encodeURIComponent(username)}`);
    fetchProducts(); // Refresh the product list
    setPdfGenerated(false);
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
};



  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4">  
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold my-4">Add Product</h2>
        <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
      <form onSubmit={addProduct} className="mb-4 flex gap-3">
        <input
          type="text"
          name="productName"
          value={newProduct.productName}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          name="productQty"
          value={newProduct.productQty}
          onChange={handleInputChange}
          placeholder="Product Qty"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          name="productRate"
          value={newProduct.productRate}
          onChange={handleInputChange}
          placeholder="Product Rate"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </form>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Rate</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">GST (18%)</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id || index} className="text-center">
              <td className="border px-4 py-2">{product.productName}</td>
              <td className="border px-4 py-2">{product.productQty}</td>
              <td className="border px-4 py-2">{product.productRate}</td>
              <td className="border px-4 py-2">{product.productTotal.toFixed(2)}</td>
              <td className="border px-4 py-2">{product.productGST.toFixed(2)}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <div className="flex justify-between items-center mt-8">
    {!pdfGenerated && (
      <button
        onClick={generatePDF}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition ease-in duration-200"
      >
        Generate PDF
      </button>
    )}

    {pdfUrl && pdfGenerated && (
      <a
        href={pdfUrl}
        download="user_products.pdf"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in duration-200"
      >
        Download PDF
      </a>
    )}
  </div>
      </table>
    </div>
  );
};

export default AddProductPage;
