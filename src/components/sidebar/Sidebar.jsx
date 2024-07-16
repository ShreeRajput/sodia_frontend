import React, { useContext, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import './sidebar.css';
import {
  RssFeed,
  Chat,
  Group,
  Bookmark
} from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserContext } from '../../context/userContext.js';
import ShowFollow from './ShowFollow.jsx';
import Settings from '../showSetting/Settings.jsx';

export default function Sidebar({ choosen, setIsShowLikes }) {
  const [userLogged] = useContext(UserContext);
  const [selected, setSelected] = useState(choosen);
  const [isShowFollow, setIsShowFollow] = useState(false);
  const [type, setType] = useState('');
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [settingsPosition, setSettingsPosition] = useState({ top: 0, left: 0 });
  const settingsRef = useRef();

  const PopupButton = () => {
    const [showPopup, setShowPopup] = useState(false);
  
    const togglePopup = () => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false)
      }, 3000);
    };
  
    return (
      <div className="popup" onClick={togglePopup}>
        <button className="sidebarButton">Show More</button>
        <span className={`popuptext ${showPopup ? "show" : ""}`} id="myPopup">Stay tuned for more!</span>
      </div>
    );
  };
  
  const handleSelect = (item) => {
    setSelected(item);
    if (item === "followers") {
      setType('followers');
      setIsShowFollow(true);
    } else if (item === "following") {
      setType('following');
      setIsShowFollow(true);
    } else {
      setType('');
      setIsShowFollow(false);
    }
    if (item !== 'settings') {
      setIsSettingsVisible(false);
    }
  };

  const toggleSettings = () => {
    if (!isSettingsVisible && settingsRef.current) {
      const rect = settingsRef.current.getBoundingClientRect();
      const topPosition = rect.top + window.scrollY + rect.height / 2;
      const leftPosition = rect.right + window.scrollX;
      setSettingsPosition({ top: topPosition, left: leftPosition });
    }
    setIsSettingsVisible(!isSettingsVisible);
  };

  return (
    <div className='sidebar'>
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link to='/sodia' className='listLink'>
            <li className={`sidebarListItem ${selected === 'feed' ? 'selected' : ''}`} onClick={() => { handleSelect('feed'); setIsShowLikes && setIsShowLikes(null) }}>
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </li>
          </Link>
          <Link to='/messenger' className='listLink'>
            <li className={`sidebarListItem ${selected === 'chats' ? 'selected' : ''}`} onClick={() => handleSelect('chats')}>
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </li>
          </Link>
          <Link to={`/profile/${userLogged?.details.username}`} className='listLink'>
            <li className={`sidebarListItem ${selected === 'profile' ? 'selected' : ''}`} onClick={() => { handleSelect('profile'); }}>
              <AccountCircleIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Profile</span>
            </li>
          </Link>
          <li className={`sidebarListItem ${selected === 'followers' ? 'selected' : ''}`} onClick={() => handleSelect('followers')}>
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Followers</span>
          </li>
          {isShowFollow && <ShowFollow type={type} setShowFollow={setIsShowFollow} />}
          <li className={`sidebarListItem ${selected === 'following' ? 'selected' : ''}`} onClick={() => handleSelect('following')}>
            <GroupAddIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Following</span>
          </li>
          <Link to='/sodia' className='listLink'>
            <li className={`sidebarListItem ${selected === 'likes' ? 'selected' : ''}`} onClick={() => { handleSelect('likes'); setIsShowLikes && setIsShowLikes('likes') }}>
              <FavoriteIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Likes</span>
            </li>
          </Link>
          <Link to='/sodia' className='listLink'>
            <li className={`sidebarListItem ${selected === 'bookmarks' ? 'selected' : ''}`} onClick={() => { handleSelect('bookmarks'); setIsShowLikes && setIsShowLikes('bookmarks') }}>
              <Bookmark className="sidebarIcon" />
              <span className="sidebarListItemText">Bookmarks</span>
            </li>
          </Link>
          <li ref={settingsRef} className={`sidebarListItem ${selected === 'settings' ? 'selected' : ''}`} onClick={()=>{handleSelect('settings');toggleSettings();}}>
            <SettingsIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Settings</span>
          </li>
        </ul>

        {isSettingsVisible && <Settings onClose={toggleSettings} position={settingsPosition} />}

        <div>
          <PopupButton />
        </div>
        <hr className="sidebarHr" />
      </div>
    </div>
  );
}
