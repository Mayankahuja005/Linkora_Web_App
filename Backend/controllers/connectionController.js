import { getMyConnections, getMyNetworkFeed, getPendingRequests, respondToRequest, sendConnectionRequest } from "../services/connectionService.js"


export const sendRequest=async (req,res)=>{
    try {
        const {receiverId}=req.params
        const request=await sendConnectionRequest(req.id,receiverId)
        res.status(200).json({
            success:true,
            message:"connection request sent succesfully",
            request
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const acceptRequest=async (req,res)=>{
    try {
        const {requestId}=req.params
        const acceptedRequest=await respondToRequest(requestId,req.id,"accept")
        res.status(201).json({
            success:true,
            message:"connection request accepted successfully",
            acceptedRequest
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const rejectRequest=async (req,res)=>{
    try {
        const {requestId}=req.params
        const rejectedRequest=await respondToRequest(requestId,req.id,"reject")
        res.status(201).json({
            success:true,
            message:"connection request rejected successfully",
            rejectedRequest
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const myFeed=async (req,res)=>{
    try {
        const feed=await getMyNetworkFeed(req.id)
        res.status(201).json({
            success:true,
            message:"feed fetched successfully",
            feed
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const getPending=async (req,res)=>{
    try {
        const pending=await getPendingRequests(req.id)
        res.status(200).json({
            success:true,
            message:"pending request fetched successfully",
            pending
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const myConnections=async (req,res)=>{
    try {
        const connections=await getMyConnections(req.id)
        res.status(200).json({
            success:true,
            message:"all connections fetched successfully",
            connections
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}
