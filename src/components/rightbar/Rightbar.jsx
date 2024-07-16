import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"
import { Add, Remove} from "@mui/icons-material"
import './rightbar.css'
import Online from '../online/Online'
import {UserContext} from "../../context/userContext.js"
import EditProfile from "../editProfile/EditProfile"


export default function Rightbar({user,setIsBioChanged}) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [loggedUser] = useContext(UserContext)
  const [friends,setFriends] = useState([])
  const [followed,setFollowed] = useState(user?.followers?.includes(loggedUser?.details._id))

  useEffect(()=> {
    const fetchFriends = ()=> {
      axios.get(`/users/friends/${user?._id}`)
        .then(response=>setFriends(response.data))
        .catch(error=>console.log(error))
    }
    if(user?._id){
      fetchFriends()
    }
  },[user])

  useEffect(()=> {
      if(user)
        setFollowed(user.followers?.includes(loggedUser?.details._id))
  },[user,loggedUser?.details])

  const followHandler = ()=> {
      try {
          axios.put(`/users/${user?._id}/follow`,{"userId":loggedUser?.details._id})
          setFollowed(!followed)
      } 
      catch (error) {
        console.log(error)
      }
  }

  const HomeRightbar = ()=>{
    const [birthdayFrds,setBirthdayFrds] = useState([])
    const [showBirthdayList,setShowBirthdayList] = useState(false)

    useEffect(()=>{
        const fetchBirthdayFrds = ()=> {
          axios.get('/users/allUsers')
            .then(response=> {
              const todate = new Date().toISOString().split('T')[0]
              const res  = response.data
              setBirthdayFrds(()=>{
                return res.filter(u=>u.birthday?.split('T')[0]===todate)
              })
            })
            .catch(error=>console.log(error))
        }
        if(loggedUser.details)
          fetchBirthdayFrds()
    },[])
      return (
          <>
              <div className="birthdayContainer" onClick={()=>setShowBirthdayList(prev=>!prev)}>
                  <img className="birthdayImg" src={PF + "gift.png"} alt="Gift" />
                  <span className="birthdayText">
                    <b>{birthdayFrds.length!==0 ? birthdayFrds.length:"No"} Sodia friends</b> have a <b>birthday</b> today, 
                        Let's {birthdayFrds.length!==0 ? "wish them!" : "invite new friends!"}
                  </span>
              </div>
              {showBirthdayList &&
                <ul className="birthdayFriendsList">
                  {showBirthdayList && 
                    birthdayFrds?.map(u => (
                      <Link to={`/messenger`} style={{ textDecoration: "none", color: "black" }} key={u.username}>
                        <li className="birthdayFriend">
                          <div className="birthdayFriendImgContainer">
                            <img  
                              className="birthdayFriendImg"
                              src={u.profilePicture || PF + 'person/noAvatar.png'} 
                              alt="friend_picture" 
                            />
                          </div>
                          <span className="birthdayFriendUsername">{u.username}</span>
                        </li>
                      </Link>
                    ))
                  }
                </ul>
              }
              <img className="rightbarAd" src={PF+"advertize.jpg"} alt="advertiseImage" />
              <h4 className="rightbarTitle" style={{marginBottom:"20px"}}>Top Sodians</h4>
              <Online />
          </>
      )
  }

  const ProfileRightbar = ()=>{
      const [profile,setProfile] = useState()
      const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

      useEffect(()=>{
        const fetchUser = ()=>{
            axios.get("/users?userId="+loggedUser.details?._id)
                .then(response=>{
                    setProfile(response.data)
                })
                .catch(error=>{
                    console.log(error)
                })
        }
        if(loggedUser.details)
          fetchUser()
      },[isEditProfileOpen])

      return (
        <>
            {
               user._id === loggedUser?.details._id ?
                    (
                      <button className="rightbarFollowButton" onClick={()=>setIsEditProfileOpen(true)} >
                          Edit Profile
                      </button>
                    ) 
                    : 
                    (
                      <button className="rightbarFollowButton" onClick={followHandler}>
                          {followed ? "Unfollow" : "Follow"}
                          {followed ? <Remove /> : <Add />}
                      </button>
                    )
            }

            {isEditProfileOpen && <EditProfile setIsEditProfileOpen={setIsEditProfileOpen} setIsBioChanged={setIsBioChanged} />}

            <h4 className="rightbarTitle">User information</h4>

            <div className="rightbarInfo">
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City :</span>
                <span className="rightbarInfoValue">{user._id === loggedUser?.details._id ? profile?.city : user.city}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Birthday :</span>
                <span className="rightbarInfoValue">{user._id === loggedUser?.details._id ? profile?.birthday?.split('T')[0] : user.birthday?.split('T')[0]}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">SocialLink :</span>
                <span className="rightbarInfoValue">{user._id === loggedUser?.details._id ? profile?.socialLink : user.socialLink}</span>
              </div>
            </div>

            <h4 className="rightbarTitle">sodia friends</h4>
            
            <div className="rightbarFollowings">
            {
              friends.map((frd)=> {
                  return <Link key={frd._id} to={"/profile/" + frd.username} style={{textDecoration:"none",color:"black"}}>
                    <div className="rightbarFollowing">
                      <img
                        src={frd.profilePicture || PF+"/person/noAvatar.png"}
                        alt="profile_picture"
                        className="rightbarFollowingImg"
                      />
                      <span className="rightbarFollowingName">{frd.username}</span>
                    </div>
                  </Link>                
              })  
            }
            {friends.length===0 && <div style={{fontSize:"larger",color:"rgb(153, 152, 152)"}}>no friends yet</div>}
            </div>
        </>
      )
  }

  return (
        <div className="rightbar">
            <div className="rightbarWrapper">
              {
                user ? <ProfileRightbar /> : <HomeRightbar />
              }  
            </div>            
        </div>
  )
}
