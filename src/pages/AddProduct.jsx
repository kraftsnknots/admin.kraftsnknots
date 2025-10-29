import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../features/productSlice";
import "./styles/AddProduct.css";

export default function AddProduct() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((s) => s.products);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    status: "Active",
    category: "Default",
    description: "",
    sku: "",
    stock: "",
    ribbon: "",
    subtitle: "",
    options: [{ name: "Size", value: "" }, { name: "Color", value: "" }],
    images: [],
    tags: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProduct(formData));
  };

  return (
    <div className="add-product-container">
      <h2 className="">Create New Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input name="title" onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status *</label>
            <select name="status" onChange={handleChange} value={formData.status}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" onChange={handleChange}>
              <option>Default</option>
              <option>Featured</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price *</label>
            <input type="number" name="price" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>SKU *</label>
            <input name="sku" onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity *</label>
            <input type="number" name="stock" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Ribbon</label>
            <input name="ribbon" onChange={handleChange} />
          </div>
        </div>

        <div className="form-group full">
          <label>Description</label>
          <textarea name="description" onChange={handleChange} rows="3" />
        </div>

        <div className="form-group full">
          <label>Subtitle</label>
          <input name="subtitle" onChange={handleChange} />
        </div>

        <div className="form-group full">
          <label>Images *</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <div className="preview-box">
            {formData.images.map((file, idx) => (
              <img key={idx} src={URL.createObjectURL(file)} alt="preview" />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">✅ Product added successfully!</p>}
      </form>
    </div>
  );
}
