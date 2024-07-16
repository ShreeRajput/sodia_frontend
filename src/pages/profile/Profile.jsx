import './profile.css'
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import {useNavigate} from "react-router-dom"
import ChangePicture from '../../components/changePictures/ChangePicture.jsx';
import { UserContext } from '../../context/userContext.js';

export default function Profile() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  const [user,setUser] = useState({})
  const [userLogged] = useContext(UserContext)
  const params = useParams();
  const navigate = useNavigate()
  const username = params.username
  const [showModel,setShowModel] = useState(0)
  const [isBioChanged,setIsBioChanged] = useState(false)

  useEffect(()=>{
    const fetchUser = async()=>{
        axios.get("/users?username="+username)
            .then(response=>{
                setUser(response.data)
            })
            .catch(error=>{
                navigate('/404page')
            })
    }
    if(username)
        fetchUser()
  },[username,isBioChanged,userLogged.details])

  return (
    <>
        <Topbar />


        <div className="profile">

            <Sidebar choosen="profile" />

            <div className="profileRight">
                <div className="profileRightTop">
                    <div className="profileCover">
                        <img
                            className="profileCoverImg"
                            src={ user?.coverPicture || PF + "person/noCover.jpg"}
                            alt="cover_photo"
                            style={{cursor: userLogged.details.username===user?.username && "pointer"}}
                            onClick={()=>userLogged.details.username===user?.username && setShowModel(2)}
                        />
                        <img
                            className="profileUserImg"
                            src={user?.profilePicture || PF+"person/noAvatar.png"}
                            alt="profile_photo"
                            style={{cursor: userLogged.details.username===user?.username && "pointer"}}
                            onClick={()=> userLogged.details.username===user?.username && setShowModel(1)}
                        />
                    </div>
                    <div className="profileInfo">
                        <h4 className="profileInfoName">{user?.username}</h4>
                        <span className="profileInfoDesc">{user?.bio || "Hey, there i'm using sodia!"}</span>
                    </div>
                </div>

                {
                    showModel===1 && <ChangePicture type="profile" picture={user?.profilePicture} setShowModel={setShowModel} />
                }
                {
                    showModel===2 && <ChangePicture type="cover" picture={user?.coverPicture} setShowModel={setShowModel} />
                }

                <div className="profileRightBottom">
                    <Feed username={username} />
                    <Rightbar user={user} setIsBioChanged={setIsBioChanged} />
                </div>

            </div>
        </div>
    </>
  )
}
