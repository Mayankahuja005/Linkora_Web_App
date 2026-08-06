import React from "react"
import { useEffect, useState } from 'react'
import useAuthStore from '../store/useAuthStore'

function Home(){

   const [users,setUsers]=useState([])
   const [loading,setLoading]=useState(true)
   const { token }=useAuthStore()
   const [toast, setToast] = useState(null);
   useEffect(() => {
       if (toast) {
         const timerId = setTimeout(() => {
           setToast(null);
         }, 3000);
   
         return () => clearTimeout(timerId);
       }
     }, [toast]);

   useEffect(()=>{
      const fetchFeed=async ()=>{
         try {
            setLoading(true)
            const response =await fetch(`${import.meta.env.VITE_API_URL}/api/connections/feed`,{
               headers:{Authorization:`Bearer ${token}`}
            })
            const data=await response.json()
            if(!response.ok){
               throw new Error(data.message || "Failed to fetch your feed")
            }
            setUsers(data.feed)
         } catch (error) {
           setToast({message: error.message,type: "error",});
         } finally{
            setLoading(false)
         }
      }
      fetchFeed()
   },[])
   const handleConnect=async (receiverId)=>{
      try {
         const response =await fetch(`${import.meta.env.VITE_API_URL}/api/connections/send/${receiverId}`,{
            method: "POST",
            headers:{Authorization:`Bearer ${token}`}
         })
         const data=await response.json()
         if(!response.ok){
            throw new Error(data.message || "Unable to connect")
         }
         setUsers((prev)=>prev.filter((user)=>user._id!==receiverId))
         setToast({message: "Connection request sent",type: "success",});
         
      } catch (error) {
        setToast({message: error.message,type: "error",});
      }
   }

   if(loading) return "Loading feed for you..."
   return (
  <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Discover People
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

      {users.length === 0 ? (
        <div className="text-center text-white text-2xl mt-20">
          No users found.
        </div>
      ) : (
        <div className="carousel carousel-vertical h-[550px] w-full rounded-box">
          {users.map((user) => (
            <div
              key={user._id}
              className="carousel-item h-full py-2"
            >
              <div className="w-[88%] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">

                <div className="relative h-44 bg-linear-to-r from-blue-700 via-cyan-500 to-indigo-600">
                  <img
                    src={user.profileImage || "https://placehold.co/250"}
                    alt={user.name}
                    className="absolute -bottom-14 left-8 w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-gray-200"
                  />
                </div>

                <div className="pt-18 px-6 pb-6">

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {user.name}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => handleConnect(user._id)}
                      className="btn btn-primary"
                    >
                      Connect
                    </button>

                  </div>

                  <div className="divider my-4"></div>

                  <h3 className="font-semibold text-lg mb-2">
                    About
                  </h3>

                  <p className="text-gray-600 leading-7">
                    {user.bio || "No bio available"}
                  </p>

                  {user.skills?.length > 0 && (
                    <>
                      <div className="divider my-4"></div>

                      <h3 className="font-semibold text-lg mb-3">
                        Skills
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="badge badge-primary badge-outline"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>);
}

export default Home