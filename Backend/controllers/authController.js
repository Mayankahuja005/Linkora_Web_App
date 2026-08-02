import { loginUser,signupUser } from "../services/authService.js"

export const signup=async (req,res)=>{
    try {
        const user=await signupUser(req.body)
        res.status(201).json({
            success:true,
            message:"user registered successfully",
            ...user
        })
    } catch (err) {
        console.log("Error while signup",err)
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}
export const login=async (req,res)=>{
    try {
        const user=await loginUser(req.body)
        res.status(200).json({
            success:true,
            message:"user loggedin successfully",
            ...user
        })
    } catch (err) {
        console.log("Error while login",err)
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}