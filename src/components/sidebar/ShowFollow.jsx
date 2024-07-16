import React, { useState, useEffect, useContext } from 'react';
import './showFollow.css';
import axios from 'axios';
import { UserContext } from '../../context/userContext.js';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

const ShowFollow = ({ type , setShowFollow }) => {
  const [userLogged] = useContext(UserContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [followers, setFollowers] = useState({});
  const [followerDetails, setFollowerDetails] = useState([]);

  useEffect(() => {
    const fetchFollowers = () => {
      axios
        .get(`/users/follow/${userLogged?.details._id}`)
        .then((response) =>{ 
          type==="followers" ?  setFollowers(response.data.followers) : setFollowers(response.data.followings)
        })
        .catch((error) => console.log(error));
    };
    fetchFollowers();
  }, [userLogged,type]);

  useEffect(() => {
    const fetchFollowDetails = async () => {
      const details = await Promise.all(
        followers.map((follower) =>
          axios
            .get(`/users?userId=${follower}`)
            .then((response) => response.data)
            .catch((error) => {
              console.log(error);
              return null;
            })
        )
      );
      setFollowerDetails(details.filter((detail) => detail !== null));
    };
    if (followers.length > 0) fetchFollowDetails();
  }, [followers]);

  return (
    <div className="modal-overlay" onClick={() => setShowFollow(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <CloseIcon className="close-icon" onClick={() => setShowFollow(false)} />
        <h2>{type==='followers' ? 'followers' : "following"}</h2>
        <ul>
          {followerDetails.map((follow) => (
            <Link to={`/profile/${follow.username}`} key={follow._id} className="list-link" onClick={()=>setShowFollow(false)}>
              <li className="follower-item">
                <img src={follow.profilePicture || `${PF}person/noAvatar.png`} alt={follow.username} className="follower-pic" />
                <span className="follower-name">{follow.username}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShowFollow