import React, { useState, useContext } from 'react';
import './settings.css';
import { UserContext } from '../../context/userContext.js';
import axios from 'axios';

export default function Settings({ position }) {
  const [userLogged, setUser] = useContext(UserContext);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAcc,setShowDeleteAcc] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUser({
      token: '',
      details: ''
    });
  };

  const ChangePassword = () =>{ 
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState({ pass: '', cPass: '' });
    const [error, setError] = useState('');
    const [isDeleting,setIsDeleting] = useState(false)

    const handleConfirm = (e)=> {
        e.preventDefault();
        if(newPassword.pass !== newPassword.cPass) {
          setError("Passwords do not match!");
          return;
        }

        axios.put('/users/changePass/'+userLogged.details._id, { userId: userLogged.details._id,password:currentPassword,newPassword: newPassword.pass })
          .then(response => {
            if(response.data.isCorrect === true) {
                alert("Password updated successfully!");
                setShowChangePassword(false);
            } else {
              setError("Password is incorrect!");
            }
          })
          .catch(error => console.log(error));
    }

    const handleDelete = (e)=>{
        e.preventDefault()
        setIsDeleting(true)
        axios.delete('/users/'+userLogged.details._id,{params: {userId: userLogged.details._id,password: currentPassword}})
          .then(response => {
            if(response.data.isCorrect !== false) {
                setIsDeleting(false)
                setShowDeleteAcc(false)
                handleLogout()
            } else {
              setError("Password is incorrect!");
            }
          })
          .catch(error => console.log(error));
    }

    return (
    <div className="modalOverlays">
      <div className="modals">
        {
          showDeleteAcc ? 
            <>
                <h2 style={{color:"rgb(222, 11, 11)"}}>Delete Account</h2>
                <form className="modalForm" onSubmit={handleDelete}>
                  <div className="inputGroup">
                    <label>Enter Current Password</label>
                    <small>(Are you sure to leave such a amazing platform?)</small>
                    {error && <div className="errorMessage">{error}</div>}
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="modalButtons">
                    <button type="button" onClick={() => {setShowDeleteAcc(false);setShowChangePassword(false)}}>Cancel</button>
                    <button type="submit" className="delBtn" disabled={isDeleting}>
                      {isDeleting ? <div className="spinner"></div> : "Delete"}
                    </button>                  
                  </div>
                </form>
            </>
            :
            <>
                <h2>Change Password</h2>
                <form className="modalForm" onSubmit={handleConfirm}>
                  <div className="inputGroup">
                    <label>Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  {error && <div className="errorMessage">{error}</div>}
                  <div className="inputGroup">
                    <label>New Password</label>
                    <input
                      type="password"
                      required
                      minLength="6"
                      value={newPassword.pass}
                      onChange={(e) => setNewPassword(prev => ({ ...prev, pass: e.target.value }))}
                    />
                  </div>
                  <div className="inputGroup">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength="6"
                      value={newPassword.cPass}
                      onChange={(e) => setNewPassword((prev) => ({ ...prev, cPass: e.target.value }))}
                    />
                  </div>
                  <div className="modalButtons">
                    <button type="button" onClick={() => setShowChangePassword(false)}>Cancel</button>
                    <button type="submit" className='confirmBtn'>Confirm</button>
                  </div>
                </form>
            </>
        }
      </div>
    </div>
  );
}
  return (
    <>
      <div className="settingsPopup" style={{ top: position.top, left:"160px" }}>
        <div className="settingsContent">
          <div className="settingsItem" onClick={handleLogout}>Logout</div>
          <div className="settingsItem" onClick={() => setShowChangePassword(true)}>Change Password</div>
          <div className="settingsItem" onClick={() => {setShowDeleteAcc(true);setShowChangePassword(true)}}>Delete Account</div>
        </div>
        <div className="settingsArrow"></div>
      </div>

      {showChangePassword && <ChangePassword />}
    </>
  );
}