import React from "react";
import { useState,useEffect } from "react";
import useAuthStore from "../store/useAuthStore"
function Profile(){
    const { token }=useAuthStore()

    const [loading,setLoading]=useState(false)
    const [data,setData]=useState(null)

    const [toast,setToast]=useState(null)

    const [isEditing,setIsEditing]=useState(false)
    const [formData,setFormData]=useState({
        name:"",
        bio:"",
        profileImage:""
    })

    const[updatingPassword,setUpdatingPassword]=useState(false)
    const [pass,setPass]=useState({
        oldPassword:"",
        newPassword:""
    })

    useEffect(()=>{
        const fetchProfile=async ()=>{
            try {
                setLoading(true)
                const response=await fetch("http://localhost:5000/api/profile/me",{
                    method:"GET",
                    headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}
                })
                const data=await response.json()
                if(!response.ok){
                    throw new Error(data.message || "Cannot Fetch Profile")
                }
                setData(data.user)
                setFormData(data.user)
            } catch (error) {
                setToast({message:error.message,type:"error"})
            } finally{
                setLoading(false)
            } 
        }
        fetchProfile()
    },[token])

    useEffect(()=>{
        if(toast){
            const timerId=setTimeout(()=>{
                setToast(null)
            },3000)
            return ()=>clearTimeout(timerId)
        }
    },[toast])

    const handleChange=(e)=>{
        e.preventDefault()
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSave=async ()=>{
        try {
            setIsEditing(true)
            const response=await fetch("http://localhost:5000/api/profile/update",{
                method:"PUT",
                headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
                body:JSON.stringify(formData)
            })
            const data=await response.json()
            console.log(data)
            if(!response.ok){
                    throw new Error(data.message || "Cannot Update Profile")
            }
            setData(data.updatedUser)
            setFormData(data.updatedUser)
            setToast({message:"Profile Updated Successfully 🎉",type:"success",});

        } catch (error) {
            setToast({ message: error.message, type: "error",});
        } finally{
            setIsEditing(false)
        }
    }

    const handleChangePassword = (e) => {
        e.preventDefault()
        setPass({...pass,[e.target.name]: e.target.value,});
    }
    const handleSavePassword=async ()=>{
        try {
            setUpdatingPassword(true)
            const response=await fetch("http://localhost:5000/api/profile/change-password",{
                method:"PUT",
                headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
                body:JSON.stringify(pass)
            })
            const data=await response.json()
            if(!response.ok){
                    throw new Error(data.message || "Cannot Update Password")
            }
            setToast({message:"Password Updated Successfully 🎉",type:"success",});
            setPass({ oldPassword: "",newPassword: ""});
        } catch (error) {
            setToast({ message: error.message, type: "error",});
        } finally{
            setUpdatingPassword(false)
        }
    }



   return (
  <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          My Profile
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage your account
        </p>
      </div>

      <div className="space-y-5">

        <div className="flex justify-center">
          <img
            src={
              data?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Full Name
          </label>

          <div className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-lg font-semibold text-gray-800">
            {data?.name}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Email
          </label>

          <div className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700 break-all">
            {data?.email}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Bio
          </label>

          <div className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700">
            {data?.bio || "No bio added"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => {
            setIsEditing(true);
            setUpdatingPassword(false);
          }}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition"
        >
          ✏️ Edit Profile
        </button>

        <button
          onClick={() => {
            setUpdatingPassword(true);
            setIsEditing(false);
          }}
          className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 transition"
        >
          🔒 Change Password
        </button>
      </div>
            {isEditing && (
        <div className="mt-8 border rounded-2xl border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-blue-700 mb-5">
            Edit Profile
          </h2>

          <input
            type="file"
            accept="image/*"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="Profile Image URL"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {formData.profileImage && (
            <img
              src={formData.profileImage}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mx-auto mt-4 border-2 border-blue-400"
            />
          )}

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your new name"
            className="w-full mt-4 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write your bio..."
            rows={4}
            className="w-full mt-4 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white py-3 font-semibold transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(data);
              }}
              className="flex-1 rounded-xl bg-gray-500 hover:bg-gray-600 text-white py-3 font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {updatingPassword && (
        <div className="mt-8 border rounded-2xl border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-amber-700 mb-5">
            Change Password
          </h2>

          <div className="space-y-4">
            <input
              type="password"
              name="oldPassword"
              value={pass.oldPassword}
              onChange={handleChangePassword}
              placeholder="Current Password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
            />

            <input
              type="password"
              name="newPassword"
              value={pass.newPassword}
              onChange={handleChangePassword}
              placeholder="New Password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSavePassword}
                className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white py-3 font-semibold transition"
              >
                Update Password
              </button>

              <button
                onClick={() => {
                  setUpdatingPassword(false);
                  setPass({
                    oldPassword: "",
                    newPassword: "",
                  });
                }}
                className="flex-1 rounded-xl bg-gray-500 hover:bg-gray-600 text-white py-3 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`mt-6 rounded-xl p-4 text-center font-semibold ${
            toast.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

    </div>
  </div>
);

}
export default Profile