import React, { useContext, useState } from 'react';
import axios from "axios"
import './changePicture.css'
import { UserContext } from '../../context/userContext';

const ChangePicture = ({type,picture,setShowModel}) => {
  const [file,setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false);
  const [loggedUser] = useContext(UserContext)  

  const uploadHandler = ()=> {
      const formData = new FormData()
      setIsUploading(true)

      if(file){
        formData.append('userId',loggedUser.details._id)
        type==='profile' ? formData.append('type',"profilePicture") : 
                           formData.append('type',"coverPicture")
        formData.append('file',file)
      }
      else{
        alert('file is not selected')
        return null
      }

      axios.put('/users/'+loggedUser.details?._id,formData,{
          headers: {
              'Content-Type': 'multipart/form-data',
          }
        })
        .then(response=>{
          setShowModel(0)
          window.location.reload();
        })
        .catch(error=>{
          setShowModel(0)
          console.log(error)
        })
  }

  const removeHandler = ()=> {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('userId',loggedUser.details._id)
      type==='profile' ? formData.append('type',"profilePicture") : 
                         formData.append('type',"coverPicture")

      axios.put('/users/'+loggedUser.details?._id,formData,{
          headers: {
              'Content-Type': 'multipart/form-data',
          }
        })
        .then(response=>{
          setShowModel(0)
          window.location.reload();
        })
        .catch(error=>{
          console.log(error)
        })

  }

  return (
    <div className="modal">
      <div className="modal-content">
      {file ? (
        <div className="shareImgContainer">
            <img
              className="preview-img"
              src={URL.createObjectURL(file)}
              alt="profile_picture"
            />
            <div className="button-container">
              <button className="button cancel" onClick={()=>setFile(null)}>Cancel</button>
              <button className="button ok" onClick={uploadHandler} disabled={isUploading}>
                {isUploading ? <div className="spinner"></div> : 'Upload'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>Change {type === "profile" ? "Profile" : "Cover"} Picture</h2>
            <label htmlFor="file" className="modal-button upload">
              Upload Photo
              <input
                type="file"
                id="file"
                name="file"
                style={{ display: "none" }}
                accept=".png,.jpeg,.jpg"
                onChange={(e)=>{setFile(e.target.files[0])}}
              />
            </label>
            {
                picture &&  <button 
                              className="modal-button remove" 
                              onClick={removeHandler}
                              disabled={isUploading}
                            >
                              {isUploading ? <div className="spinner"></div> : 'Remove Photo'}
                            </button>
            }
            {/* <button 
              className="modal-button remove" 
              onClick={removeHandler}
              disabled={isUploading}
            >
              {isUploading ? <div className="spinner"></div> : 'Remove Photo'}
            </button> */}
            <button className="modal-button cancel" onClick={()=>setShowModel(0)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePicture;
