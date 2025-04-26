import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {getCookie} from "../utils/getCookie.js";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = getCookie('JWT_TOKEN');
    if (token) {
      localStorage.setItem('jwt', token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [])

  return <div>Logging in...</div>
}

export default OAuth2RedirectHandler
