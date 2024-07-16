import React, { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../../context/userContext';
import { Search, Chat } from '@mui/icons-material';
import './topbar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Topbar() {
    const [loggedUser] = useContext(UserContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [profile, setProfile] = useState();
    const [searchedUser, setSearchedUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            axios.get(`/users?userId=${loggedUser?.details?._id}`)
                .then(response => {
                    setProfile(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if(loggedUser.details)
            fetchUser()
    }, [loggedUser]);

    const handleSearch = useCallback((e) => {
        const query = e.target.value;
        if (query.length > 2) {
            axios.get(`/users/search/${query}`)
                .then(response => { setSearchedUser(response.data); })
                .catch(error => console.log(error));
        } else {
            setSearchedUser([]);
        }
    }, []);

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <span className="logo">Sodia</span>
                </Link>
            </div>

            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className='searchIcon' />
                    <input placeholder="Search for friend .." className="searchInput" onChange={handleSearch} />
                </div>
                {searchedUser.length > 0 && (
                    <div className="searchResults">
                        <ul>
                            {searchedUser.slice(0, 4).map((user, index) => (
                                <Link key={user._id} to={`/profile/${user.username}`} style={{textDecoration:"none"}}>
                                    <li className="searchResultItem">
                                        <img src={user.profilePicture || `${PF}person/noAvatar.png`} alt="" className="searchResultImg" />
                                        <span style={{color:"black"}}>{user.username}</span>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to='/sodia' style={{ textDecoration: 'none' }}>
                        <span className="topbarLink">Homepage</span>
                    </Link>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Link to='/messenger' style={{ textDecoration: 'none',color:"white" }}>
                            <Chat />
                        </Link>
                    </div>
                    <Link to={profile && `/profile/${profile?.username}`}>
                        <img src={profile?.profilePicture || `${PF}person/noAvatar.png`} alt="profilePicture" className="topbarImg" />
                    </Link>
                </div>
            </div>
        </div>
    );
}