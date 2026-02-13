import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {

  const navigate = useNavigate();

  // 🔥 NEW STATES
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  // 🔥 LOGIN FUNCTION
  const handleLogin = async ()=>{
    try{
      await signInWithEmailAndPassword(auth,email,password);
      navigate("/menu"); // login success
    }catch(err){
      alert("Login Failed ❌");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">

      <div className="bg-white w-[420px] p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h1>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-red-400"
        />

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-red-400"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-lg font-semibold"
        >
          Sign In
        </button>
      </div>

    </div>
  );
}
