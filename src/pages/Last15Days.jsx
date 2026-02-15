import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Last15Days() {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    if (!auth.currentUser) return;

    // 🔥 TODAY DATE
    const now = new Date();

    // 🔥 15 DAYS BACK DATE
    const startDate = new Date();
    startDate.setDate(now.getDate() - 15);

    // 🔥 FIREBASE QUERY
    const q = query(
      collection(db, "orders"),
      where("userEmail", "==", auth.currentUser.email),
      where("createdAt", ">=", startDate),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {

      let arr = [];

      snapshot.forEach(doc => {
        arr.push(doc.data());
      });

      setOrders(arr);
    });

    return () => unsub();

  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* 🔥 BACK BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Last 15 Days Orders
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-4 p-4 border-b font-semibold text-gray-500">
          <p>Token</p>
          <p>Payment</p>
          <p>Date</p>
          <p>Amount</p>
        </div>

        {/* DATA */}
        {orders.map((o, i) => (

          <div key={i} className="grid grid-cols-4 p-4 border-b">

            <p className="font-semibold">
              #{o.tokenNo}
            </p>

            <p className={
              o.payment === "Online"
                ? "text-green-500 font-semibold"
                : "text-orange-500 font-semibold"
            }>
              {o.payment}
            </p>

            <p>
              {
                o.createdAt
                  ? o.createdAt.toDate().toLocaleDateString()
                  : ""
              }
            </p>

            <p className="font-semibold">
              ₹{o.total}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
