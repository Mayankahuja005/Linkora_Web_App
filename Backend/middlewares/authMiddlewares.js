import jwt from "jsonwebtoken"

const protect=(req,res,next)=>{

    const authHeaders=req.headers.authorization

    if(!authHeaders || !authHeaders.startsWith("Bearer")){
        return res.status(400).json({
            success:false,
            message:"token not found"
        })
    }
    console.log(authHeaders)
    console.log(authHeaders.split(" "))
    const token=authHeaders.split(" ")[1]
    console.log("token at middleware",token)
    
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log("decoded",decoded)
        req.id=decoded.userId
        next()
    }
    catch(err){
        res.status(401).json({
            success:false,
            message:"Invalid token or expire token "
        })
    }
}
export default protect