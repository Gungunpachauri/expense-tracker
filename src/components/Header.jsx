export default function Header({ total }) {
  return (
    <header className="header">
      <h1>Expense Tracker</h1>
      <p className="total">Total: ₹{total.toFixed(2)}</p>
    </header>
  );
}
