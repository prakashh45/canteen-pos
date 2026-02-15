import { useState, useEffect } from "react";
import ReceiptModal from "../components/ReceiptModal";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function Menu() {

  const [cart, setCart] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [now, setNow] = useState(new Date());

  const navigate = useNavigate();

  // 🔥 LIVE CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 🔥 ADMIN MENU (LOCAL STORAGE)
  const adminMenu = JSON.parse(localStorage.getItem("menuItems")) || [];
  const allItems = [...adminMenu];

  const filteredItems = allItems
    .filter(item => activeFilter === "All" || item.category === activeFilter)
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  // 🔥 CART FUNCTIONS
  const addToCart = (item) => {
    const exist = cart.find(c => c.id === item.id);
    if (exist) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increase = (id) => {
    setCart(cart.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c));
  };

  const decrease = (id) => {
    setCart(cart.map(c => c.id === id && c.qty > 1 ? { ...c, qty: c.qty - 1 } : c));
  };

  const removeItem = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  // 🔥 PLACE ORDER
  const placeOrder = async () => {

    if (!cart || cart.length === 0) {
      alert("Cart is empty ❌");
      return;
    }

    if (!paymentType) {
      alert("Select Payment Type ⚠");
      return;
    }

    const orderData = {
      tokenNo: Math.floor(1000 + Math.random() * 9000),
      items: cart,
      subtotal,
      total,
      payment: paymentType,
      userEmail: auth.currentUser?.email,
      createdAt: new Date(),
    };

    try {
      setReceipt(orderData);
      await addDoc(collection(db, "orders"), orderData);
      setCart([]);
      setPaymentType("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">

        {/* 🔥 NAVBAR */}
        <div className="bg-white px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-red-500 font-bold text-xl">🍴 Hindavi Canteen</h1>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-gray-100 px-4 py-2 rounded-full w-[400px]"
          />

          <div
            onClick={() => navigate("/admin")}
            className="cursor-pointer font-semibold"
          >
            🔔 Admin
          </div>

          <div className="text-sm">
            {now.toLocaleDateString()} | {now.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex">

          {/* 🔥 LEFT MENU */}
          <div className="w-2/3 p-8">

            <div className="flex gap-3 mb-6 overflow-x-auto">
              {["All", "Burgers", "Meals", "Snacks", "tea", "Drinks"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 whitespace-nowrap rounded-full ${
                    activeFilter === cat
                      ? "bg-red-500 text-white"
                      : "bg-white shadow"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-xl shadow">

                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-red-500 font-semibold">₹{item.price}</p>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-red-100 text-red-500 w-full mt-4 py-2 rounded-lg"
                  >
                    + Add to Order
                  </button>

                </div>
              ))}
            </div>

          </div>

          {/* 🔥 RIGHT CART */}
          <div className="w-1/3 bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">🛒 Your Order</h2>

            {cart.map(item => (
              <div key={item.id} className="mb-4 border-b pb-3">

                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <button onClick={() => removeItem(item.id)}>❌</button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => decrease(item.id)} className="bg-gray-200 px-3 rounded">-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increase(item.id)} className="bg-gray-200 px-3 rounded">+</button>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  ₹{(item.price * item.qty).toFixed(2)}
                </p>

              </div>
            ))}

            <hr />

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span className="text-red-500">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setPaymentType("Online")}
                className={`flex-1 py-2 rounded-lg ${
                  paymentType === "Online"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Online
              </button>

              <button
                onClick={() => setPaymentType("Cash")}
                className={`flex-1 py-2 rounded-lg ${
                  paymentType === "Cash"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Cash
              </button>
            </div>

            <button
              onClick={placeOrder}
              className="bg-red-500 text-white w-full mt-6 py-3 rounded-lg font-semibold"
            >
              Place Order →
            </button>

          </div>

        </div>
      </div>

      {/* 🔥 RECEIPT POPUP */}
      <ReceiptModal order={receipt} onClose={() => setReceipt(null)} />
    </>
  );
}