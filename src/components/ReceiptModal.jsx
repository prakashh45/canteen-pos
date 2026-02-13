export default function ReceiptModal({ order, onClose }) {

  if (!order) return null;

  const printReceipt = () => {
    window.print();
  };

  // 🔥 SAFE DATE CONVERT (Firestore + Local both support)
  const getDate = () => {
    if (!order.createdAt) return "";
    if (order.createdAt.seconds) {
      return new Date(order.createdAt.seconds * 1000);
    }
    return new Date(order.createdAt);
  };

  const orderDate = getDate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* RECEIPT BOX */}
      <div className="bg-white w-[320px] p-4 rounded-lg font-mono text-sm">

        <h2 className="text-center font-bold text-lg">
          Hindavi Canteen
        </h2>

        <p className="text-center">Order Receipt</p>

        {/* 🔥 ORDER INFO */}
        <div className="mt-3">
          <p>Token No : {order.tokenNo}</p>

          <p>Date : {orderDate ? orderDate.toLocaleDateString() : ""}</p>

          <p>Time : {orderDate ? orderDate.toLocaleTimeString() : ""}</p>

          <p>Payment : {order.payment}</p>
        </div>

        <hr className="my-2" />

        {/* 🔥 ITEMS */}
        {order.items?.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name} x{item.qty}</span>
            <span>₹{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}

        <hr className="my-2" />

        {/* 🔥 TOTALS */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{order.subtotal?.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{order.total?.toFixed(2)}</span>
        </div>

        <p className="text-center mt-3">
          Thank You ❤️
        </p>

        {/* 🔥 BUTTONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={printReceipt}
            className="flex-1 bg-red-500 text-white py-2 rounded"
          >
            Print
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
