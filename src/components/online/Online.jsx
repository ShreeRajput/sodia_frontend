import { useEffect, useState } from 'react'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import './online.css'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Online({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [allUsers,setAllUsers] = useState([])
  useEffect(()=>{
    const fethcTopUsers = ()=> {
        axios.get('/users/allUsers')
          .then(response=>{
            if (response.data.length > 8) {
              setAllUsers(response.data.slice(0, 8))
            } else {
              setAllUsers(response.data)
            }
          })
          .catch(error=>console.log(error))
    }
    fethcTopUsers()
  },[])

  return (
    <>
        <ul className="rightbarFriendList">
            {
              allUsers?.map((u)=>(
                <Link key={u._id} to={`/profile/${u.username}`} style={{textDecoration:"none",color:"black"}}>
                  <li className="rightbarFriend">
                      <div className="rightbarProfileImgContainer">
                          <img  
                            className="rightbarProfileImg"
                            src={u.profilePicture || PF+'person/noAvatar.png'} 
                            alt="friend_picture" 
                          />
                      </div>
                      <span className="rightbarUsername">
                          {u.username}   {<WorkspacePremiumIcon htmlColor='#800800' />}
                      </span>
                  </li>
                </Link>
              ))
            }
        </ul>
    </>
  )
}
