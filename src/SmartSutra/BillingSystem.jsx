import React, { useState } from "react";
import "./BillingSystem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faCheckToSlot,
} from "@fortawesome/free-solid-svg-icons";

function Billingsystem() {
  const emptyForm = { name: "", item: "", qty: "", price: "", date: "" };

  const [sales, setSales] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (Object.values(form).some((val) => !val)) {
      alert("Please fill all fields");
      return;
    }

    const newSale = {
      ...form,
      qty: Number(form.qty),
      price: Number(form.price),
    };

    if (editIndex !== null) {
      const updated = [...sales];
      updated[editIndex] = newSale;
      setSales(updated);
      setEditIndex(null);
    } else {
      setSales([...sales, newSale]);
    }

    setForm(emptyForm);
  };

  const handleDelete = (saleToDelete) => {
    setSales(sales.filter((s) => s !== saleToDelete));
  };

  const handleEdit = (saleToEdit) => {
    setForm({ ...saleToEdit });
    const actualIndex = sales.indexOf(saleToEdit);
    setEditIndex(actualIndex);
  };

  const filteredSales = filterDate
    ? sales.filter((sale) => sale.date === filterDate)
    : sales;

  const totalSales = filteredSales.reduce(
    (sum, sale) => sum + sale.qty * sale.price,
    0,
  );

  const customerTotals = sales.reduce((acc, sale) => {
    const amount = sale.qty * sale.price;
    acc[sale.name] = (acc[sale.name] || 0) + amount;
    return acc;
  }, {});

  const monthlyTotals = sales.reduce((acc, sale) => {
    const dateObj = new Date(sale.date);
    const month = isNaN(dateObj)
      ? "Unknown"
      : dateObj.toLocaleString("default", { month: "long" });

    const amount = sale.qty * sale.price;
    acc[month] = (acc[month] || 0) + amount;
    return acc;
  }, {});

  return (
    <div className="container">
      <img src="/public/Smartsutra.png" className="corner-logo" />

      <h1>Billing Dashboard</h1>

      <div className="form">
        {["name", "item", "qty", "price", "date"].map((field) => (
          <input
            key={field}
            type={field === "qty" || field === "price" ? "number" : field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
          />
        ))}

        <button onClick={handleSubmit} className="icon-submit-btn">
          <FontAwesomeIcon icon={editIndex !== null ? faPen : faCheckToSlot} />
        </button>
      </div>

      <div className="filter">
        <label>Filter by Date: </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.name}</td>
              <td>{sale.item}</td>
              <td>{sale.qty}</td>
              <td>₹{sale.price}</td>
              <td>₹{sale.qty * sale.price}</td>
              <td>{sale.date}</td>
              <td>
                <div className="action-buttons">
                  <FontAwesomeIcon
                    icon={faPen}
                    className="icon edit-icon"
                    onClick={() => handleEdit(sale)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon delete-icon"
                    onClick={() => handleDelete(sale)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="grand-total">Grand Total: ₹{totalSales}</h2>

      <div className="summary-section">
        <div className="summary">
          <h3>Customer Totals</h3>
          {Object.entries(customerTotals).length > 0 ? (
            Object.entries(customerTotals).map(([name, total], i) => (
              <p key={i}>
                <strong>{name}:</strong> ₹{total}
              </p>
            ))
          ) : (
            <p>No records</p>
          )}
        </div>

        <div className="summary">
          <h3>Monthly Sales</h3>
          {Object.entries(monthlyTotals).length > 0 ? (
            Object.entries(monthlyTotals).map(([month, total], i) => (
              <p key={i}>
                <strong>{month}:</strong> ₹{total}
              </p>
            ))
          ) : (
            <p>No records</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Billingsystem;
