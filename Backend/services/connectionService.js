import { createConnectionRequest, findAllAcceptedConnections, findAllPendingRequestForUser, findExistingRequestBetween, findRequestId, updateRequestStatus,findAllRequestForUser } from "../repositories/connectionRepository.js"
import { findIncludedUserIds } from "../repositories/userRepository.js"


export const sendConnectionRequest=async (senderId,receiverId)=>{

    if(senderId===receiverId){
        throw new Error("you cannot send request to yourself")
    }
    const existing=await findExistingRequestBetween(senderId,receiverId)

    if(existing.length>0){
        throw new Error("A request already exist between these users")
    }
    return await createConnectionRequest(senderId,receiverId)
}

export const respondToRequest=async (requestId,userId,action)=>{

    const request=await findRequestId(requestId)
    if(!request){
        throw new Error("Request not found")
    }
    if(request.status!=="pending"){
        throw new Error("you already responded")
    }
    if(request.receiver.toString()!==userId){
        throw new Error("you are not authorized to respond to this request")
    }
    const status=action==="accept"?"accepted":"rejected"
    return await updateRequestStatus(requestId,status)
}

export const getMyNetworkFeed=async (userId)=>{

    const allRequests=await findAllRequestForUser(userId)
    const excludeIds=allRequests.map((req)=>{
        return req.sender.toString()===userId?req.receiver.toString():req.sender.toString()
    })
    excludeIds.push(userId)
    return await findIncludedUserIds(excludeIds)
}

export const getPendingRequests=async (userId)=>{
    return await findAllPendingRequestForUser(userId)
}

export const getMyConnections=async (userId)=>{
    return await findAllAcceptedConnections(userId)
}