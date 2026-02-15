import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import MenuManagement from "./pages/MenuManagement";
import Orders from "./pages/Orders";
import Last15Days from "./pages/Last15Days";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 LOGIN PAGE */}
        <Route path="/" element={<Login />} />

        {/* MENU PAGE */}
        <Route path="/menu" element={<Menu />} />

        {/* ADMIN DASHBOARD */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/last15days" element={<Last15Days/>}/>


      </Routes>
    </BrowserRouter>
  );
}
