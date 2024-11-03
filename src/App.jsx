import React, { useEffect, useMemo, useState } from "react";
//components
import Header from "./components/Header";

<Header total={total} />


const STORAGE_KEY = "expense_tracker_expenses_v1";

function formatDate(dateStr) {
  if (!dateStr) return "No date";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",

  });
}

function loadInitialExpenses() {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stored expenses", e);
    return [];
  }
}

export default function App() {
  const [expenses, setExpenses] = useState(loadInitialExpenses);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    if (!filterMonth) return expenses;
    const [year, month] = filterMonth.split("-");
    return expenses.filter((exp) => {
      if (!exp.date) return false;
      const d = new Date(exp.date);
      return (
        d.getFullYear().toString() === year &&
        String(d.getMonth() + 1).padStart(2, "0") === month
      );
    });
  }, [expenses, filterMonth]);

  const total = useMemo(
    () => filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0),
    [filteredExpenses]
  );

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const numericAmount = Number(amount);
    if (!trimmedTitle || !numericAmount || numericAmount <= 0) {
      alert("Please enter a valid title and amount.");
      return;
    }
    const todayStr = new Date().toISOString().slice(0, 10);
    const newExpense = {
      id: Date.now().toString(),
      title: trimmedTitle,
      amount: numericAmount,
      category: category.trim(),
      date: date || todayStr,
    };
    setExpenses((prev) => [...prev, newExpense]);
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
  }

  function handleDelete(id) {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  }

  function handleClearAll() {
    const ok = window.confirm("Are you sure you want to delete ALL expenses?");
    if (!ok) return;
    setExpenses([]);
  }

  function handleClearFilter() {
    setFilterMonth("");
  }

  return (
    <div className="app">
      <h1>Expense Tracker (React)</h1>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Add Expense</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            placeholder="e.g. Food, Rent, Travel"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btn primary">
          Add Expense
        </button>
      </form>

      <div className="summary card">
        <h2>Summary</h2>
        <p>
          Total Expenses: <span id="total-amount">₹{total.toFixed(2)}</span>
        </p>

        <div className="form-group inline">
          <label htmlFor="filter-month">Filter by month</label>
          <input
            id="filter-month"
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />
        </div>
        <button onClick={handleClearFilter} className="btn">
          Clear Filter
        </button>
      </div>

      <div className="card">
        <h2>Expenses</h2>
        <ul className="expense-list">
          {filteredExpenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-main">
                <span className="expense-title">{expense.title}</span>
                <span className="expense-meta">
                  {formatDate(expense.date)}
                  {expense.category && (
                    <span className="expense-category-pill">
                      {expense.category}
                    </span>
                  )}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="expense-amount">
                  ₹{Number(expense.amount).toFixed(2)}
                </span>
                <div className="expense-actions">
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredExpenses.length === 0 && (
          <p className="empty-state">
            No expenses yet. Add your first one!
          </p>
        )}
      </div>

      <button className="btn danger full-width" onClick={handleClearAll}>
        Clear All Expenses
      </button>
    </div>
  );
}