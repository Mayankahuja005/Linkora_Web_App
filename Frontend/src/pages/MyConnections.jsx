import React, { useEffect, useState,useRef } from "react"
import socket from "../socket/socket";
import useAuthStore from "../store/useAuthStore"
function MyConnections(){
    const [incomingCall, setIncomingCall] = useState(null)
    const [connections,setConnections]=useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const { token,user } = useAuthStore()
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null)
    const [remoteUserId, setRemoteUserId] = useState(null)
    const peerConnection = useRef(null)
    const [callStarted, setCallStarted] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [cameraOff, setCameraOff] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [callTime, setCallTime] = useState(0)
    useEffect(() => {
        if (toast) {
          const timerId = setTimeout(() => {
            setToast(null)
          }, 3000)
    
          return () => clearTimeout(timerId);
        }
    }, [toast])

    useEffect(()=>{
        const fetchConnections =async ()=>{
            try {
                setLoading(true)
                const response =await fetch(`${import.meta.env.VITE_API_URL}/api/connections/my-connection`,{
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

    const handleCall = async (receiverId) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setCallStarted(true);
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      })
      peerConnection.current.oniceconnectionstatechange = () => {
         console.log("ICE State:", peerConnection.current.iceConnectionState);
      }
      peerConnection.current.ontrack = (event) => {
        console.log("TRACK RECEIVED", event.streams);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            receiverId
          });
        }
      }
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });
      
      setLocalStream(stream)
      setTimeout(() => {
        localVideoRef.current.srcObject = stream;
      }, 100)
      setRemoteUserId(receiverId)
      socket.emit("call-user", {
        receiverId,
        callerId: user.userId,
      })
    }

    const handleMute = () => {
      const audioTrack = localStream?.getAudioTracks()[0]
      if (!audioTrack) return
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }

      const handleCamera = () => {
        const videoTrack = localStream?.getVideoTracks()[0]
        if (!videoTrack) return
          videoTrack.enabled = !videoTrack.enabled
          setCameraOff(!videoTrack.enabled)
      }

      const handleFullscreen = () => {
        const container = document.getElementById("video-call-container");

        if (!document.fullscreenElement) {
          container.requestFullscreen()
          setIsFullscreen(true)
        } else {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }

      useEffect(() => {
        if (!callStarted) return;
        const interval = setInterval(() => {
          setCallTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
      }, [callStarted])

     
    const handleAccept =async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
      })
      setCallStarted(true);
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          }
        ]
      })
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log("ICE State:", peerConnection.current.iceConnectionState);
      }
      peerConnection.current.ontrack = (event) => {
        console.log("TRACK RECEIVED", event.streams)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
          receiverId: incomingCall,
          })
        }
      }
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream)
      })
      setLocalStream(stream);
      setTimeout(() => {
        localVideoRef.current.srcObject = stream
      }, 100)
      socket.emit("accept-call", {
        callerId: incomingCall,
        receiverId: user.userId,
      })
      setIncomingCall(null)
    }

    const handleReject = () => {
      socket.emit("reject-call", {
        callerId: incomingCall,
        receiverId: user.userId,
      })
    }

    const handleEndCall = () => {
      localStream?.getTracks().forEach((track) => track.stop());
      peerConnection.current?.close()
      setCallStarted(false)
      setCallTime(0)
      socket.emit("end-call", {
        receiverId: remoteUserId})

      setIncomingCall(null)
      setLocalStream(null)
      setRemoteUserId(null)

      if (localVideoRef.current) localVideoRef.current.srcObject = null
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
    }
    useEffect(() => 
      {
        socket.on("incoming-call", ({ callerId }) => {
          setIncomingCall(callerId)
          setRemoteUserId(callerId)
          console.log("Incoming Call From:", callerId)
        })
       socket.on("call-accepted", async ({ receiverId }) => {
          console.log("Call Accepted by:", receiverId);

          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);

          socket.emit("offer", {
            offer,
            receiverId,
          })
        })
        socket.on("call-rejected", ({ receiverId }) => {
          console.log("Call Rejected by:", receiverId);
        })

        socket.on("offer", async ({ offer, callerId }) => {
          console.log("Offer Received", offer)
          console.log("Peer:", peerConnection.current)

          while (!peerConnection.current) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          )

          const answer = await peerConnection.current.createAnswer()
          await peerConnection.current.setLocalDescription(answer)

          socket.emit("answer", {
            answer,
            callerId,
          })
        })

        socket.on("answer", async ({ answer }) => {
          console.log("Answer Received", answer)
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          )
        })
        socket.on("ice-candidate", async ({ candidate }) => {
          if (peerConnection.current && peerConnection.current.remoteDescription) {
            await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate))
          }
        })
        socket.on("end-call", () => {
          localStream?.getTracks().forEach((track) => track.stop())
          peerConnection.current?.close()
          setCallStarted(false)
          setCallTime(0)
        })
      return () => {
        socket.off("incoming-call")
        socket.off("call-rejected")
        socket.off("call-accepted")
        socket.off("answer")
        socket.off("offer")
        socket.off("ice-candidate")
        socket.off("end-call");}
      }, 
    [])

    if(loading) return "Loading your connections..."

    return (
  <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 py-8 px-4">

    {/* Incoming Call Popup */}
    {incomingCall && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-[90%] max-w-sm rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            📞
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            Incoming Call
          </h2>

          <p className="mt-2 text-gray-500">
            Someone is calling you...
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAccept}
              className="flex-1 rounded-full bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
            >
              ✅ Accept
            </button>

            <button
              onClick={handleReject}
              className="flex-1 rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              ❌ Reject
            </button>
          </div>

        </div>
      </div>
    )}

    {/* Video Call */}
    {callStarted && (
      <div
        id="video-call-container"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
      >
        <div
          className={`w-full ${
            isFullscreen ? "max-w-full h-full rounded-none" : "max-w-6xl rounded-3xl"
          } max-h-[95vh] overflow-y-auto bg-slate-900 p-4 sm:p-6 shadow-2xl`}
        >

          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white">
            📹 Video Call
          </h2>

          <p className="mt-3 mb-5 text-center text-base sm:text-xl font-bold text-green-400">
            {Math.floor(callTime / 60).toString().padStart(2, "0")}:
            {(callTime % 60).toString().padStart(2, "0")}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Local Video */}
            <div>
              <h3 className="mb-3 text-center font-semibold text-white">
                You
              </h3>

              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-56 sm:h-72 lg:h-80 rounded-2xl border-4 border-blue-500 bg-black object-cover shadow-xl"
              />
            </div>

            {/* Remote Video */}
            <div>
              <h3 className="mb-3 text-center font-semibold text-white">
                Remote User
              </h3>

              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-56 sm:h-72 lg:h-80 rounded-2xl border-4 border-green-500 bg-black object-cover shadow-xl"
              />
            </div>

          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <button
              onClick={handleMute}
              className="w-full sm:w-auto rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600"
            >
              {isMuted ? "🎤 Unmute" : "🔇 Mute"}
            </button>

            <button
              onClick={handleCamera}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              {cameraOff ? "📷 Camera On" : "📷 Camera Off"}
            </button>

            <button
              onClick={handleFullscreen}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {isFullscreen ? "🗗 Exit Fullscreen" : "🗖 Fullscreen"}
            </button>

            <button
              onClick={handleEndCall}
              className="w-full sm:w-auto rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              ❌ End Call
            </button>

          </div>

        </div>

      </div>
    )}

    {/* Remaining UI */}
    <div className="max-w-6xl mx-auto">

      <h1 className="mb-8 text-center text-3xl sm:text-4xl font-bold text-white">
        My Connections
      </h1>

      {toast && (
        <div
          className={`mx-auto mb-6 max-w-md rounded-xl border px-4 py-3 text-center font-medium ${
            toast.type === "success"
              ? "border-green-300 bg-green-100 text-green-700"
              : "border-red-300 bg-red-100 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      {connections.length === 0 ? (
        <div className="mt-20 text-center text-xl text-white">
          You don't have any connections yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {connections.map((connection) => {
            const otherUser =
              connection.sender._id === user?.userId
                ? connection.receiver
                : connection.sender;

            return (
              <div
                key={connection._id}
                className="overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                {/* Cover */}
                <div className="h-32 bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600"></div>

                {/* Profile */}
                <div className="-mt-14 flex flex-col items-center px-6 pb-6">

                  <img
                    src={otherUser.profileImage || "https://placehold.co/200"}
                    alt={otherUser.name}
                    className="h-28 w-28 rounded-full border-4 border-white bg-gray-200 object-cover shadow-lg"
                  />

                  <h2 className="mt-4 text-2xl font-bold text-gray-800">
                    {otherUser.name}
                  </h2>

                  <p className="mt-1 text-center text-gray-500">
                    {otherUser.email}
                  </p>

                  <p className="mt-3 text-center text-gray-600">
                    {otherUser.bio || "No bio available"}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 w-full">

                    <button
                      onClick={() => handleCall(otherUser._id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 font-bold text-white shadow-lg transition hover:bg-green-600"
                    >
                      📞 Audio
                    </button>

                    <button
                      onClick={() => handleCall(otherUser._id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600"
                    >
                      📹 Video
                    </button>

                  </div>

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
