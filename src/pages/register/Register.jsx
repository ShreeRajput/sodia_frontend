import { useRef, useState } from "react";
import axios from "axios"
import { Visibility, VisibilityOff } from '@mui/icons-material';
import "./register.css";
import { useNavigate } from "react-router-dom";


export default function Register() {

  const [showPassword, setShowPassword] = useState({
    password: false,
    cPassword: false
  });

  const navigate = useNavigate()

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const cPassword = useRef();
  const [userExist,setUserExist] = useState('');
  const [isPasswordMatch,setIsPasswordMatch] = useState('')
  const [showVerifyEmail,setShowVerifyEmail] = useState(false)
  const [isPosting,setIsPosting] = useState(false)

  const togglePasswordVisibility = (e) => {

    const name1 = e.currentTarget.getAttribute('name') // const { name } = e.currentTarget.dataset;

    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [name1]: !prevShowPassword[name1]
    }));

  };

  const handleSubmit = (e) => {

      e.preventDefault();
      setUserExist('')
      setIsPosting(true)

      if (password.current.value !== cPassword.current.value) {
        return setIsPasswordMatch("Passwords do not match!");
      } else {
        setIsPasswordMatch('')
      }

      const userDetails = {
        "username" : username.current.value,
        "email" : email.current.value,
        "password" : password.current.value
      }

      axios.post('/auth/register',userDetails)
        .then(response => {
            setIsPosting(false)
            setShowVerifyEmail(true)
        })
        .catch(error => {
            setIsPosting(false)
            setUserExist(error.response.data.msg)
        })
  };

  const EmailVerification = () => {
      const [otp, setOtp] = useState('');
      const [error,setError] = useState('')
      const [isVerifying,setIsVerifying] = useState(false)

      const handleOtp = ()=>{
          setError('')
          setIsVerifying(true)
          axios.post('/auth/verifyOtp',{email:email.current.value,otp:otp})
            .then(response=>{
                setIsVerifying(false)
                navigate('/login')
            })
            .catch(error=>{
                setIsVerifying(false)
                setError(error.response.data.msg)
                setTimeout(() => {
                  setShowVerifyEmail(false)
                  setUserExist('reEnter your details for registration')
                }, 3500);
            })
      }

      return (
        <div className="email-verification-background">
          <div className="email-verification-container">
            <small className="email-verification-heading">(verification code has been sent to email) </small>
            <input
              className="email-verification-input"
              type="text"
              placeholder="Enter Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div style={{color:"red"}}>{error}</div>
            <div className="email-verification-button-container">
              <button className="email-verification-cancel-button" onClick={()=>{handleOtp();setShowVerifyEmail(false)}} >Cancel</button>
              <button className="email-verification-verify-button" onClick={handleOtp} disabled={isVerifying} >
                {isVerifying ? <div className='spinning'></div> : "Verify"}  
              </button>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Sodiaverse</h3>
          <span className="loginDesc">
            Explore, connect, and share your world with Sodiaverse.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="loginInput"
              minLength="2"
              ref={username}
              required
            />
            <small>(Verification Code will be sent to entered mail..)</small>
            {userExist && <div style={{color:"blue",fontWeight:"500"}}>{userExist}</div>}
            <input
              type="email"
              placeholder="Email"
              className="loginInput"
              ref={email}
              required
            />
            <div className="passwordContainer">
              <input
                placeholder="Password"
                type={showPassword.password ? 'text' : 'password'}
                minLength="6"
                className="loginInput passwordInput"
                style={{ border: "none" }}
                ref={password}
                required
              />
              <div
                className="passwordToggle"
                name="password" // data-name="password"
                onClick={togglePasswordVisibility}
              >
                {showPassword.password ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            {isPasswordMatch && <div style={{color:"red",fontWeight:"500"}}>{isPasswordMatch}</div>}
            <div className="passwordContainer">
              <input
                placeholder="Password Again"
                type={showPassword.cPassword ? 'text' : 'password'}
                minLength="6"
                className="loginInput passwordInput"
                style={{ border: "none" }}
                ref={cPassword}
                required
              />
              <div
                className="passwordToggle"
                name="cPassword" // data-name="cPassword"
                onClick={togglePasswordVisibility}
              >
                {showPassword.cPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            {showVerifyEmail && <EmailVerification />}
            <button className="loginButton" type='submit' disabled={isPosting} >
                {isPosting ? <div className='spinning'></div> : "Sign Up"}  
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
