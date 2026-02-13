export default function OrderHistory() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Order History</h1>

      <div className="bg-white mt-6 p-5 rounded-xl shadow">
        <h2>#ORD-7721</h2>
        <p>Total Amount $42.50</p>
        <button className="border border-red-500 text-red-500 px-4 py-1 rounded">
          Reorder
        </button>
      </div>
    </div>
  );
}
