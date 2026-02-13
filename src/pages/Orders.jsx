import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

export default function Orders() {

  const [orders,setOrders] = useState([]);
  const navigate = useNavigate();

  // 🔥 REALTIME EMAIL WISE ORDERS
  useEffect(()=>{

    // ⚠️ user load झाला नसेल तर crash टाळण्यासाठी
    if(!auth.currentUser) return;

    const q = query(
      collection(db,"orders"),
      where("userEmail","==",auth.currentUser.email),
      orderBy("createdAt","desc")
    );

    const unsub = onSnapshot(q,(snapshot)=>{

      const data = snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }));

      setOrders(data);

    });

    return ()=>unsub();

  },[]);

  return(
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <div className="w-[240px] bg-[#2b0b0b] text-white p-6">
        <h1 className="text-xl font-bold mb-10">🍴 GustoAdmin</h1>

        <div className="space-y-4">

          <p
            onClick={()=>navigate("/admin")}
            className="cursor-pointer opacity-80"
          >
            Dashboard
          </p>

          <p
            onClick={()=>navigate("/menu-management")}
            className="cursor-pointer opacity-80"
          >
            Menu Management
          </p>

          <p className="bg-red-500 px-4 py-2 rounded-lg">
            Orders
          </p>

        </div>
      </div>

      {/* 🔥 MAIN AREA */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">
          Orders Table
        </h1>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-4 p-4 border-b text-gray-500 font-semibold">
            <p>Token No</p>
            <p>Customer</p>
            <p>Payment</p>
            <p>Amount</p>
          </div>

          {/* ROWS */}
          {orders.map(order=>(
            <div
              key={order.id}
              className="grid grid-cols-4 p-4 border-b"
            >
              <p className="font-semibold">
                #{order.tokenNo}
              </p>

              <p>Walk-In</p>

              <p className={`font-semibold ${
                order.payment==="Online"
                  ? "text-green-500"
                  : "text-orange-500"
              }`}>
                {order.payment}
              </p>

              <p>₹{order.total}</p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
