import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import './sodia.css'

export default function Sodia() {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false)
          navigate('/sodia')
        }, 4000); 
    
        return () => clearTimeout(timer)
    }, [navigate]);


    return (
      <>
        {isLoading && 
            <div className="loadingContainer">
                <img src={`${PF}logo.png`} alt="logoPicture" className="logoImg" />
                <div className="loadingTextContainer">
                    <small>from</small>
                    <strong>SodiaVerse</strong>
                </div>
            </div>
        }
     </>
    )
}
