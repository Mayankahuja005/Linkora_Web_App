import { createUser,findUserByEmail } from "../repositories/userRepository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signupUser=async ({name,email,password})=>{
    const existingUser=await findUserByEmail(email)
    if(existingUser){
        throw new Error("User already exist")
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const newUser=await createUser({name,email,password:hashedPassword})
    return{userId:newUser._id,name:newUser.name,email:newUser.email}
}
export const loginUser=async ({email,password})=>{
    const user=await findUserByEmail(email)
    if(!user){
        throw new Error("Invalid email or password")
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Invalid email or password")
    }
    const token=await jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"24h"})

    return{token,
        user:{
        userId:user._id,
        email:user.email,
        name:user.name
    }}
}