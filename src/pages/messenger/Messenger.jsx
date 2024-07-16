import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from "axios"
import {io} from "socket.io-client"
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import "./messenger.css"
import Message from '../../components/message/Message'
import { UserContext } from '../../context/userContext'
import Sidebar from "../../components/sidebar/Sidebar.jsx"

function Messenger() {

    const [conv,setConv] = useState([])
    const [messages,setMessages] = useState([])
    const socket = useRef()
    const [currentConv,setCurrentConv] = useState(null)
    const [receivedMsg,setReceivedMsg] = useState(null)
    const newMessage = useRef()
    const scrollRef = useRef()
    const [user] = useContext(UserContext)
    const [convsId,setConvsId] = useState()

    useEffect(() => {
        socket.current = io("https://sodiaverse-socket.onrender.com");

        socket.current.on("connect", () => {
            if (user?.details._id) {
                socket.current.emit("addUser", { userId: user.details._id });
            }
        })

        socket.current.on("receiveMessage",(data)=>{
            setReceivedMsg({
                sender : data.senderId,
                text : data.text,
                createdAt : Date.now()
            })
        })

        return () => {
            socket.current.disconnect();
        };
    }, [user]);

    useEffect(()=>{
        if (receivedMsg && currentConv?.members.includes(receivedMsg.sender)) {
            setMessages((prevMessages) => [...prevMessages, receivedMsg]);
        }
    },[receivedMsg,currentConv])

    useEffect(()=> {
        const getConv = ()=>{
            axios.get('/conversation/'+user?.details._id)
                .then(response =>{
                    setConv(response.data)
                })
                .catch(error =>{
                    console.error(error);
                })
        }
        getConv()   
    },[user])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    useEffect(()=>{
        const fetchMessages = ()=>{
            axios.get('/message/'+convsId)
            .then(response =>{
                setMessages(response.data)
            })
            .catch(error =>{
                console.error(error);
            })
        }
        if(convsId)
            fetchMessages()
    },[convsId])

    const handleClick = (c,receiverId)=> {
        if(!c) {    
            axios.post('/conversation',{"senderId":user.details?._id,"receiverId":receiverId})
                .then(response=>{
                    setConv(conv=>[...conv,response.data])
                    setCurrentConv(response.data)
                    setConvsId(response.data._id)
                })
                .catch(error=>{
                    if(error.response.data.msg==="Conversation Already Exists!"){
                        setCurrentConv(error.response.data.conv[0])
                        setConvsId(error.response.data.conv[0]._id)
                    }else{
                        console.log(error)
                    }
                })
        } else{
            setCurrentConv(c)
            setConvsId(c._id)
        }
    }

    const handleSubmit = (e)=> {
        e.preventDefault()
        const msg = newMessage.current.value

        if(msg==="")
            return null

        if(!currentConv){
            newMessage.current.value = ''
            alert("select friend first to start conversation")
            return null
        }
        axios.post('/message',{
                "conversationId" : currentConv._id,
                "sender" : user.details._id,
                "text" : msg
            })
            .then(response =>{
                setMessages([...messages,response.data])
                newMessage.current.value = ""
            })
            .catch(error =>{
                console.error(error);
            })

        const receiverId = currentConv.members.find(ele=> ele!==user.details._id)
        socket.current.emit("sendMessage",{
            senderId : user.details._id,
            receiverId,
            text : msg
        })

    }

  return (
    <>
        <Topbar />

        <div className="messenger">

            <Sidebar choosen="chats" />

            <div className="chatBox">
                <div className="chatBoxWrapper">
                    <div className="chatBoxTop">
                       {
                            messages.map((msg,index)=>{
                                return <div ref={scrollRef} key={index}> 
                                        <Message msg={msg} own={msg.sender===user.details._id} />
                                    </div>
                            })
                       }
                    </div>

                    <form className="chatBoxBottom" onSubmit={handleSubmit}>
                        <textarea
                            ref={newMessage}
                            className="chatMessageInput"
                            placeholder="write something..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    handleSubmit(e);
                                }
                            }
                        />
                        <button className="chatSubmitButton" type='submit'>
                            Send
                        </button>
                    </form>

                </div>
            </div>
            
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <Conversation 
                        convs={conv} 
                        userId={user.details?._id} 
                        handleClick = {handleClick}
                    />
                </div>
            </div>

        </div>

    </>
  )
}

export default Messenger
