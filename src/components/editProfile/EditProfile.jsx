import React, { useContext, useEffect, useState } from 'react';
import './editProfile.css';
import {UserContext} from "../../context/userContext.js"
import axios from "axios"

const EditProfile = ({setIsEditProfileOpen,setIsBioChanged}) => {

    const userLogged = useContext(UserContext)
    const [user,setUser] = useState({})

    useEffect(()=>{
        const fetchUser = ()=>{
            axios.get('/users?userId='+userLogged[0].details?._id)
              .then(response=>{
                  setUser(response.data)
              })
              .catch(error=>{
                console.log(error)
              })
        }

        if(userLogged)
          fetchUser()
    },[userLogged])

    const [formData, setFormData] = useState({
        bio : user.bio || '',
        city : user.city || '',
        birthday : user.birthday?.split('T')[0] || '',
        socialLink : user.socialLink || ''
    });
    

    useEffect(()=>{
        setFormData({
          bio : user.bio || '',
          city : user.city || '',
          birthday : user.birthday?.split('T')[0] || '',
          socialLink : user.socialLink || ''
      })
    },[user])

  const handleChange = (e) => {
      
      setFormData((prev)=>{
          const value = e.target.value
          const name = e.target.getAttribute('name')
          return  {
            ...prev,
            [name] : value
          }
      })
  };

  const handleSubmit = (e) => {
        e.preventDefault()
        setIsBioChanged(true)

        const newData = {
          userId : user._id,
          bio : formData.bio,
          city : formData.city,
          birthday : formData.birthday,
          socialLink : formData.socialLink
        }
        
        axios.put('/users/'+user._id,newData)
          .then(response=>{
            setIsEditProfileOpen(false)
            //setUser(response.data)
            // window.location.reload();
          })
          .catch(error=>{
            console.log(error)
          })

  };

  return (
    <div className="editProfileOverlay">
      <div className="editProfileContainer">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Bio</label>
            <textarea 
              name="bio"
              value={formData.bio} 
              onChange={handleChange}
              placeholder="Enter Bio"
            />
          </div>
          <div className="formGroup">
            <label>city</label>
            <input 
              type="text" 
              value={formData.city}
              onChange={handleChange}
              name="city" 
              placeholder="Enter City"
            />
          </div>
          <div className="formGroup">
            <label>Birthday</label>
            <input 
              type="date" 
              value={formData.birthday}
              onChange={handleChange}
              name="birthday" 
              className="birthdayClass"
            />
          </div>
          <div className="formGroup">
            <label>Social Link</label>
            <input 
              type="text" 
              value={formData.socialLink}
              onChange={handleChange}
              name="socialLink" 
              placeholder="Enter Social Link"
            />
          </div> 
          <div className="buttonGroup">
            <button type="button" className="cancelButton" onClick={()=>setIsEditProfileOpen(false)}>Cancel</button>
            <button type="submit" className="saveButton">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
