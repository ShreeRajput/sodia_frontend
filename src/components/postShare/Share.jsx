import React, { useContext, useRef, useState, useEffect } from 'react'
import {UserContext} from "../../context/userContext.js"
import './share.css'
import {PermMedia, Label,Room, Cancel} from "@mui/icons-material"
import axios from "axios"
import AddTags from './AddTags.jsx'

export default function Share() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [loggedUser] = useContext(UserContext)
    const [file,setFile] = useState(null)
    const desc = useRef()
    const [profile,setProfile] = useState()
    const [showTagWindow, setShowTagWindow] = useState(false);
    const [tags, setTags] = useState('');
    const [location, setLocation] = useState('');
    const [type,setType] = useState()
    const [isPosting,setIsPosting] = useState(false)

    useEffect(()=>{
        const fetchUser = async()=>{
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
    },[loggedUser])

    const handleSubmit = async(e)=> {
            e.preventDefault()
            const description = desc.current.value
        
            const formData = new FormData();
            formData.append('description', description);
            formData.append('userId', profile?._id);
            formData.append('location', location);
            formData.append('tags', tags);

            if (file) {
                setIsPosting(true)
                formData.append('file', file);
            }
            else{
                alert("file is not selected")
                return null
            }

            try {

                await axios.post('/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                window.location.reload() //instead of refreshing page WE CAN CREATE POST CONTEXT AND UPDATE POST STATE
            } 
            catch (err) {
                setIsPosting(false)
                console.error(err);
            }
            
    }

    return (
        <div className='share'>
            <div className="shareWrapper">

                <div className="shareTop">
                    <img src={ profile?.profilePicture || (PF + "person/noAvatar.png") } alt="profile_picture" className="shareProfileImg" />
                    <input 
                        placeholder = "what's going on!" 
                        className="shareInput"
                        ref={desc}
                    />
                </div>

                <hr className="shareHr" />
                {file && (
                        <div className="shareImgContainer">
                        {file.type.startsWith("image/") ? (
                            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        ) : file.type.startsWith("video/") ? (
                            <video controls className="shareImg">
                            <source src={URL.createObjectURL(file)} type={file.type} />
                            Your browser does not support the video tag.
                            </video>
                        ) : null}
                        <Cancel htmlColor='#fff' className="shareCancelImg" onClick={() => setFile(null)} />
                        </div>
                    )
                }
                {(tags || location) && (
                    <div className="shareSelectedTagsLocation">
                        {tags && <div className="shareSelectedTags"><span style={{fontWeight:"500",color:"black"}}>Tags:</span> {tags}</div>}
                        {location && <div className="shareSelectedLocation"><span style={{fontWeight:"500",color:"black"}}>Location:</span> {location}</div>}
                    </div>
                )}

                <form className="shareBottom" onSubmit={handleSubmit} >
                    <div className="shareOptions">
                        <label htmlFor='file' className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon"/>
                            <span className="shareOptionText">Photo or Video</span>
                            <input 
                                type='file' 
                                id='file' 
                                name='file' 
                                style={{display:"none"}} 
                                accept='.png,.jpeg,.jpg,.mp4' 
                                onChange={(e)=>{setFile(e.target.files[0])}} 
                            />
                        </label>
                        <div className="shareOption" onClick={()=>{setShowTagWindow(true);setType('tag')}}>
                            <Label htmlColor="blue" className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        {
                            showTagWindow ? <AddTags type={type} tags={tags} setTags={setTags} location={location} setLocation={setLocation} setShowTagWindow={setShowTagWindow} /> : null
                        }
                        <div className="shareOption" onClick={()=>{setShowTagWindow(true);setType('location')}} >
                            <Room htmlColor="green" className="shareIcon"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                    </div>
                    <button className="shareButton" type='submit' disabled={isPosting} >
                        {isPosting ? <div className='spinner'></div> : "post"}  
                    </button>
                </form>

            </div>
        </div>
    )
}