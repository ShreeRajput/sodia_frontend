import React, { useContext, useRef, useState } from 'react';
import {useNavigate} from "react-router-dom"
import { UserContext } from '../../context/userContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios"
import './login.css';
import ForgotPassword from '../../components/forgotPassword/ForgotPassword';

export default function Login() {

  const [showPassword, setShowPassword] = useState(false)
  const email = useRef()
  const password = useRef()
  const navigate = useNavigate()
  const [user,setUser] = useContext(UserContext)
  const [isPosting,setIsPosting] = useState(false)
  const [error,setError] = useState(false)
  const [showForgotPass,setShowForgotPass] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e)=> {
    e.preventDefault()
    setIsPosting(true)
    const userCredentials = {
      email : email.current.value,
      password : password.current.value
    }

    axios.post('/auth/login', userCredentials)
      .then(response => {
        const token = response.data.token
        const details  = response.data.user
        setUser({
          "token" : token,
          "details" : details
        })

        const store = {
          "token" : token,
          "details" : details
        }
        localStorage.setItem("jwtToken",JSON.stringify(store))
        setIsPosting(false)
        navigate('/sodia')
      })
      .catch(error => {
        setIsPosting(false)
        setError(error.response.data.msg)
      })
  }

  return (
    <>
      {showForgotPass && <ForgotPassword setShowForgotPass={setShowForgotPass} />}
      <div className="logins">
        <div className="loginWrappers">
          <div className="loginLefts">
            <h3 className="loginLogos">Sodiaverse</h3>
            <span className="loginDescs">
              Explore, connect, and share your world with Sodiaverse.  
            </span>
          </div>
          <div className="loginRights">
            <form className="loginBoxs" onSubmit={handleSubmit}>
              <input
                placeholder="Email"
                type="email"
                className="loginInputs"
                ref = {email}
                required
              />
              <div className="passwordContainers">
                <input
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  minLength="6"
                  className="loginInputs passwordInputs"
                  style = {{border:"none"}} 
                  ref = {password}
                  required
                />
                <div className="passwordToggles" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </div>
              </div>
              {error && <div style={{color:"red",fontWeight:"500"}}>
                            {error}
                        </div>
              }
              <button className="loginButtons" type='submit' disabled={isPosting} >
                {isPosting ? <div className='spinninggs'></div> : "Log In"}  
              </button>
              <div style={{display:"flex",justifyContent:"center"}}>
                  <span className="passForgots" onClick={()=>setShowForgotPass(true)}>Forgot Password?</span>
              </div> 
              <input type='button' value="Create a New Account" className="registerButtons" onClick={()=>{navigate('/register')}} />      
            </form>
          </div>
        </div>
      </div>
    </>
  );
}