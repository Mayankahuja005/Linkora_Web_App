import React, { useEffect, useState } from "react"
import useAuthStore from "../store/useAuthStore"
function Pending(){
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const { token } = useAuthStore();

    useEffect(() => {
        if (toast) {
            const timerId = setTimeout(() => {
                setToast(null);
            }, 3000);
            return () => clearTimeout(timerId);
        }
    },[toast]);

    useEffect(()=>{
        const fetchPending=async ()=>{
            try {
                setLoading(true);
                const response =await fetch(`${import.meta.env.VITE_API_URL}/api/connections/pending`,{
                                    headers:{Authorization:`Bearer ${token}`}
                                })
                const data=await response.json()
                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch your pending requests")
                }
                setRequests(data.pending);
            } catch (error) {
                setToast({message: error.message,type: "error",});
            } finally{
            setLoading(false)
            }
        }
        fetchPending()
    },[token])

    const handleAccept=async (requestId)=>{
        try {
            const response =await fetch(`${import.meta.env.VITE_API_URL}/api/connections/accept/${requestId}`,{
                                method:"PUT",
                                headers:{Authorization:`Bearer ${token}`}
                            })
            const data=await response.json()
            if(!response.ok){
                throw new Error(data.message || "Failed to accept request")
            }
             setToast({message: "Request Accepted 🎉",type: "success"});
            setRequests((prev)=>prev.filter((request)=>request._id!==requestId))
        } catch (error) {
            setToast({message: error.message,type: "error",});
        }
        
    }
    const handleReject=async (requestId)=>{
        try {
            const response =await fetch(`${import.meta.env.VITE_API_URL}/api/connections/reject/${requestId}`,{
                                method:"PUT",
                                headers:{Authorization:`Bearer ${token}`}
                            })
            const data=await response.json()
            if(!response.ok){
                throw new Error(data.message || "Failed to reject request")
            }
             setToast({message: "Request Rejected",type: "success"});
            setRequests((prev)=>prev.filter((request)=>request._id!==requestId))
        } catch (error) {
            setToast({message: error.message,type: "error",});
        }
    }

    if (loading) return "Loading pending requests...";

    return (<div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8">
        Pending Requests
      </h1>

      {toast && (
        <div
          className={`max-w-md mx-auto mb-6 rounded-xl px-4 py-3 text-center font-medium ${
            toast.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center text-white text-2xl mt-20">
          No Pending Requests
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
            >
              <div className="h-32 bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600"></div>

              <div className="flex flex-col items-center px-6 pb-6 -mt-14">
                <img
                  src={
                    request.sender.profileImage ||
                    "https://placehold.co/200"
                  }
                  alt={request.sender.name}
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg bg-gray-200"
                />

                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  {request.sender.name}
                </h2>

                <p className="text-gray-500 mt-1">
                  {request.sender.email}
                </p>

                <p className="text-center text-gray-600 mt-3">
                  {request.sender.bio || "No bio available"}
                </p>

                <div className="flex gap-3 w-full mt-6">
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(request._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>);
}

export default Pending;