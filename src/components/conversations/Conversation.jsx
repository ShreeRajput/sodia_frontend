import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './conversation.css'

export default function Conversation({ convs, userId, handleClick }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [friends, setFriends] = useState([])
  const searchRef = useRef()
  const [selected,setSelected] = useState()
  const [searchedUser, setSearchedUser] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendIds = convs.map(c => {  return c.members[0] === userId ? c.members[1] : c.members[0]})
        const friendRequests = friendIds.map(id => axios.get('/users?userId=' + id))
        const friendResponses = await Promise.all(friendRequests)
        setFriends(friendResponses.map(response => response.data))
      } catch (error) {
        console.error(error)
      }
    }
    fetchFriends()
  }, [convs, userId])

  const handleSearchQuery = useCallback((e) => {
    const query = e.target.value;
    if (query.length > 2) {
        axios.get(`/users/search/${query}`)
            .then(response => { setSearchedUser(response.data) })
            .catch(error => console.log(error))
    } else {
        setSearchedUser([])
    }
  }, []);

  const handleSearchClick = (receiverId)=> {
      handleClick(null,receiverId)
      setSearchedUser([])
      searchRef.current.value=''
      setSelected(receiverId)
  }

  return (
    <>
       <div className="searchContainer">
          <input
            placeholder="Search for friends"
            className="chatMenuInput"
            onChange={handleSearchQuery}
            ref={searchRef}
          />
          {searchedUser.length > 0 && (
            <div className="searchResult">
              <ul>
                {searchedUser.slice(0, 3).map((user) => (
                  <li key={user._id} className="searchResultItems" onClick={()=>handleSearchClick(user._id)}>
                    <img
                      src={user.profilePicture || `${PF}person/noAvatar.png`}
                      alt=""
                      className="searchResultImg"
                    />
                    <span style={{ color: "black" }}>{user.username}{user._id===userId&&"(self)"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
    </div>
        {friends.map((friend,index) => (
          <div key={friend._id} className={selected===friend._id ? "conversation selected":"conversation"} onClick={() => {handleClick(convs[index],friend._id);setSelected(friend._id)}} >
            <img
              className="conversationImg"
              src={friend.profilePicture || PF + 'person/noAvatar.png'}
              alt="profile_picture"
            />
            <span className="conversationName">{friend.username}{friend._id===userId&&"(self)"}</span>
          </div>
        ))}
    </>
  )
}