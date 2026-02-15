import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Dashboard() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [onlineTotal, setOnlineTotal] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
  const [mode, setMode] = useState("today"); // 🔥 today / 15days

  // 🔥 REALTIME EMAIL + DATE FILTER
  useEffect(() => {

    if (!auth.currentUser) return;

    const now = new Date();
    let startDate;

    if (mode === "today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date();
      startDate.setDate(now.getDate() - 15);
    }

    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", auth.currentUser.email),
      where("createdAt", ">=", startDate)
    );

    const unsub = onSnapshot(q, (snapshot) => {

      let allOrders = [];
      let revenue = 0;
      let online = 0;
      let cash = 0;

      snapshot.forEach(doc => {
        const data = doc.data();
        allOrders.push(data);

        revenue += data.total || 0;

        if (data.payment === "Online") online += data.total || 0;
        if (data.payment === "Cash") cash += data.total || 0;
      });

      setOrders(allOrders);
      setTotalRevenue(revenue);
      setOnlineTotal(online);
      setCashTotal(cash);

    });

    return () => unsub();

  }, [mode]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <div className="w-[240px] bg-[#2b0b0b] text-white p-6">
        <h1 className="text-xl font-bold mb-10">🍴 GustoAdmin</h1>

        <div className="space-y-4">
          <p className="bg-red-500 px-4 py-2 rounded-lg">Dashboard</p>

          <p
            onClick={() => navigate("/menu-management")}
            className="opacity-80 cursor-pointer"
          >
            Menu Management
          </p>

          <p
            onClick={() => navigate("/orders")}
            className="opacity-80 cursor-pointer"
          >
            Orders
          </p>
        </div>

        <div className="mt-20 opacity-80">
          <p
            onClick={handleLogout}
            className="text-red-400 mt-3 cursor-pointer"
          >
            ↪ Sign Out
          </p>
        </div>
      </div>

      {/* 🔥 MAIN */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        <button
          onClick={() => navigate("/menu")}
          className="bg-red-500 text-white px-5 py-2 rounded-lg mb-4"
        >
          Go To Menu
        </button>

        {/* 🔥 FILTER BUTTONS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("today")}
            className={`px-5 py-2 rounded-lg mb-6 ml-3 ${mode === "today" ? "bg-red-500 text-white" : "bg-white"
              }`}
          >
            Today
          </button>

          <button
            onClick={() => navigate("/last15days")}
            className="bg-red-500 text-white px-5 py-2 rounded-lg mb-6 ml-3"
          >
            Last 15 Days Page
          </button>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-bold">{orders.length}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Revenue</p>
            <h2 className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</h2>
          </div>

        </div>

        {/* 🔥 PAYMENT BOXES */}
        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Online Payments</p>
            <h2 className="text-3xl font-bold text-green-500">
              ₹{onlineTotal.toFixed(2)}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {orders.filter(o => o.payment === "Online").length} Orders Paid Online
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Cash Payments</p>
            <h2 className="text-3xl font-bold text-orange-500">
              ₹{cashTotal.toFixed(2)}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {orders.filter(o => o.payment === "Cash").length} Orders Paid Cash
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
