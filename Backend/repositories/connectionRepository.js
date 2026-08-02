import ConnectionRequest from "../models/connectionRequest.js"

//1. create a connection request
export const createConnectionRequest=async (senderId,receiverId)=>{
    return await ConnectionRequest.create({
        sender:senderId,
        receiver:receiverId
    })
}
//2.Intution:kya connection exist karta hai doo user ke beech me
export const findExistingRequestBetween=async (userA,userB)=>{
    return await ConnectionRequest.find({
        $or:[
            {sender:userA,receiver:userB},
            {sender:userB,receiver:userA}
        ]
    })
}
//3.Intution:requestId nikalo agr kahi agge use aye to kaam a sake ye
export const findRequestId=async (requestId)=>{
    return await ConnectionRequest.findById(requestId)
}
//4.(Intution:Status update->pending->accepted,rejected) jo bhi apko status update karna hai uski apke pass requestId to honi hi chaiye na,
//kyuki phele to me check karunga ki connection hai bhi ki nahi or agr krta hai to uss particular id ke status ko hi update karunga na
export const updateRequestStatus=async (requestId,status)=>{
    return await ConnectionRequest.findByIdAndUpdate(requestId,{status},{new:true})
}
//5.Intution:find all request for user,array of objects of IDs
export const findAllRequestForUser=async (userId)=>{
    return await ConnectionRequest.find({
        $or:[
            {sender:userId},
            {receiver:userId}
        ]
    })
}
//6.Intution:find pending request for user takki pending page pe dikha sake
export const findAllPendingRequestForUser=async (userId)=>{
    return await ConnectionRequest.find({
        receiver:userId,
        status:"pending",
    }).populate("sender","name email bio profileImage")
}
//7.Intution:find all accepted connection
export const findAllAcceptedConnections=async (userId)=>{
    return await ConnectionRequest.find({
        $or:[
            {sender:userId},
            {receiver:userId}
        ],
        status:"accepted"
    })
    .populate("sender","name email bio profileImage")
    .populate("receiver","name email bio profileImage")

}