import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MenuManagement() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [menu, setMenu] = useState([]);

  // 🔥 CATEGORY STATE
  const categories = ["All","Burgers","Drinks","Meals","Tea","Snacks"];
  const [activeCat,setActiveCat] = useState("All");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("menuItems")) || [];
    setMenu(data);
  }, []);

  const saveMenu = (items) => {
    setMenu(items);
    localStorage.setItem("menuItems", JSON.stringify(items));
  };

  const addItem = () => {
    if (!name || !price) return;

    const newItem = {
      id: Date.now(),
      name,
      price: Number(price),
      status: true,
      category: activeCat === "All" ? "Tea" : activeCat
    };

    saveMenu([...menu, newItem]);
    setName("");
    setPrice("");
  };

  const deleteItem = (id) => {
    saveMenu(menu.filter(item => item.id !== id));
  };

  const toggleStatus = (id) => {
    const updated = menu.map(item =>
      item.id === id ? { ...item, status: !item.status } : item
    );
    saveMenu(updated);
  };

  // 🔥 FILTERED MENU
  const filteredMenu =
    activeCat === "All"
      ? menu
      : menu.filter(i => i.category === activeCat);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <div className="w-[240px] bg-[#2b0b0b] text-white p-6">

        <h1 className="text-xl font-bold mb-10">🍴 FoodAdmin</h1>

        <p
          onClick={() => navigate("/admin")}
          className="cursor-pointer"
        >
          Dashboard
        </p>

        <p className="bg-white text-orange-500 px-3 py-2 rounded-lg font-semibold mt-3">
          Menu Management
        </p>

        <p
          className="mt-4 cursor-pointer"
          onClick={() => navigate("/menu")}
        >
          ↩ Back To Menu
        </p>

      </div>

      {/* 🔥 MAIN */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">Menu Management</h1>

        {/* 🔥 CATEGORY SCROLLER */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2 whitespace-nowrap rounded-full border ${
                activeCat === cat
                  ? "bg-orange-500 text-white"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🔥 ADD ITEM BOX */}
        <div className="flex gap-3 mb-6">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
            className="border p-2 rounded w-[200px]"
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-2 rounded w-[120px]"
          />

          <button
            onClick={addItem}
            className="bg-orange-500 text-white px-5 rounded"
          >
            + Add New Item
          </button>

        </div>

        {/* 🔥 TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="grid grid-cols-4 p-4 text-gray-500 border-b font-semibold">
            <p>ITEM NAME</p>
            <p>PRICE</p>
            <p>STATUS</p>
            <p>ACTIONS</p>
          </div>

          {filteredMenu.map(item => (
            <div
              key={item.id}
              className="grid grid-cols-4 p-4 items-center border-b"
            >
              <p>{item.name}</p>

              <p>${item.price}</p>

              <button
                onClick={() => toggleStatus(item.id)}
                className={`px-3 py-1 rounded-full w-[100px] ${
                  item.status
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {item.status ? "Available" : "Sold Out"}
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
