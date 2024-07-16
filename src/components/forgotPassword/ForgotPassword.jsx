import React,{useState} from 'react'
import axios from 'axios'
import './forgotPassword.css'

export default function ForgotPassword ({setShowForgotPass}) {
    const [otp, setOtp] = useState('')
    const [forgotEmail, setForgotEmail] = useState('');
    const [error,setError] = useState('')
    const [isVerifying,setIsVerifying] = useState(false)
    const [showOtpUi,setShowOtpUi] = useState(false) 
    const [showResetPass,setShowResetPass] = useState(false)
    const [password,setPassword] = useState('')
    const [cPassword,setCPassword] = useState('') 

    const handleOtp = (e)=>{
        e.preventDefault()
        setError('')
        setIsVerifying(true)
        axios.post('/auth/verifyOtp',{email:forgotEmail,otp:otp})
          .then(response=>{
              setIsVerifying(false)
              setShowOtpUi(false)
              setShowResetPass(true)
          })
          .catch(error=>{
              setIsVerifying(false)
              setError(error.response.data.msg)
          })
    }

    const handleForgotPass = (e)=> {
        e.preventDefault()
        setIsVerifying(true)
        axios.get('/auth/forgotpass/'+forgotEmail)
          .then(response=> {
            setIsVerifying(false)
            setShowOtpUi(true)
          })
          .catch(error=>{
            console.log(error.response)
          })
    }

    const handleResetPass = (e)=> {
        e.preventDefault()
        setError('')
        setIsVerifying(true)
        axios.put('/auth/reSetPass',{email:forgotEmail,password:password})
          .then(response=>{
              setIsVerifying(false)
              setShowForgotPass(false)
          })
          .catch(error=>{
              setIsVerifying(false)
              setError(error.response.data.msg)
          })
    }

    return (
      <div className="forgotPass-background">
        <div className="forgotPass-container">
            {showOtpUi ? <>
                        <small className="forgotPass-heading">(verification code has been sent to email)</small>
                        <input
                            className="forgotPass-input"
                            type="text"
                            placeholder="Enter Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <div style={{color:"red"}}>{error}</div>
                        <div className="forgotPass-button-container">
                            <button className="forgotPass-cancel-button" onClick={()=>{setShowForgotPass(false)}}>Cancel</button>
                            <button className="forgotPass-verify-button" onClick={handleOtp} disabled={isVerifying} >
                            {isVerifying ? <div className='spinning'></div> : "Verify"}  
                            </button>
                        </div>
                    </>
            :
              showResetPass ? 
                  <>
                      <div className="forgotPass-heading">Enter New Password..</div>
                      <form onSubmit={handleResetPass}>
                        <input
                            className="forgotPass-input"
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className="forgotPass-input"
                            type="password"
                            placeholder="Enter Password Again"
                            required
                            value={cPassword}
                            onChange={(e) => setCPassword(e.target.value)}
                        />
                        <div style={{color:"red"}}>{error}</div>
                        <div className="forgotPass-button-container">
                            <button className="forgotPass-cancel-button" onClick={()=>{setShowForgotPass(false)}}>Cancel</button>
                            <button className="forgotPass-verify-button" type='submit' disabled={isVerifying} >
                            {isVerifying ? <div className='spinning'></div> : "Set"}  
                            </button>
                        </div>
                      </form>
                  </>
                  :
                  <>
                      <div className="forgotPass-heading">Enter your registered email..</div>
                      <small>(verification code will be sent to email)</small>
                      <input
                          className="forgotPass-input"
                          type="email"
                          placeholder="Enter Email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                      />
                      <div style={{color:"red"}}>{error}</div>
                      <div className="forgotPass-button-container">
                          <button className="forgotPass-cancel-button" onClick={()=>{setShowForgotPass(false)}}>Cancel</button>
                          <button className="forgotPass-verify-button" onClick={handleForgotPass} disabled={isVerifying} >
                          {isVerifying ? <div className='spinning'></div> : "Send"}  
                          </button>
                      </div>
                  </>
            }
        </div>
      </div>
    );
};