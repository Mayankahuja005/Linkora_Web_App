import React, { useEffect, useState } from "react"
import useAuthStore from "../store/useAuthStore"
function MyConnections(){
    const [connections,setConnections]=useState([])
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const { token,user } = useAuthStore();

    useEffect(() => {
        if (toast) {
          const timerId = setTimeout(() => {
            setToast(null);
          }, 3000);
    
          return () => clearTimeout(timerId);
        }
    }, [toast]);

    useEffect(()=>{
        const fetchConnections =async ()=>{
            try {
                setLoading(true)
                const response =await fetch("http://localhost:5000/api/connections/my-connection",{
                                    headers:{Authorization:`Bearer ${token}`}
                                })
                const data=await response.json()
                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch your connections")
                }
                setConnections(data.connections)
            } catch (error) {
                setToast({message: error.message,type: "error",});
            } finally{
                setLoading(false)
            }
        }
        fetchConnections()
    },[token])

    if(loading) return "Loading your connections..."

  return (
  <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8">
        My Connections
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

      {connections.length === 0 ? (
        <div className="text-center text-white text-xl mt-20">
          You don't have any connections yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => {
            const otherUser =
              connection.sender._id === user?.userId
                ? connection.receiver
                : connection.sender;

            return (
              <div
                key={connection._id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cover */}
                <div className="h-32 bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600"></div>

                {/* Profile */}
                <div className="flex flex-col items-center px-6 pb-6 -mt-14">
                  <img
                    src={otherUser.profileImage || "https://placehold.co/200"}
                    alt={otherUser.name}
                    className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg bg-gray-200"
                  />

                  <h2 className="mt-4 text-2xl font-bold text-gray-800">
                    {otherUser.name}
                  </h2>

                  <p className="text-gray-500 mt-1 text-center">
                    {otherUser.email}
                  </p>

                  <p className="text-gray-600 text-center mt-3">
                    {otherUser.bio || "No bio available"}
                  </p>

                  {otherUser.skills?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {otherUser.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge badge-primary badge-outline"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
    
}
export default MyConnections