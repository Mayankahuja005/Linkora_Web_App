import React from "react"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"
function Logout(){
    const { logout }=useAuthStore()
    const [toast,setToast]=useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        if (toast) {
          const timerId = setTimeout(() => {
            setToast(null);
          }, 3000);
    
          return () => clearTimeout(timerId);
        }
      }, [toast])

      const handleLogout=()=>{
        setToast({
        message: "Logout Successfully 🎉",
        type: "success",});
        setTimeout(()=>{
            logout()
            navigate("/login")
        },1500)
      }


    return (<div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">
          Linkora
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          You're about to leave your account.
        </p>
      </div>

      <div className="text-center">
        <div className="text-6xl mb-4">👋</div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
          Logout
        </h2>

        <p className="text-gray-500 text-sm sm:text-base mb-6">
          Are you sure you want to logout from your account?
        </p>

        {toast && (
          <div
            className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-center mb-5 ${
              toast.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {toast.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-full bg-gray-200 hover:bg-gray-300 active:scale-[0.98] text-gray-800 py-3 rounded-xl font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>);
}
export default Logout