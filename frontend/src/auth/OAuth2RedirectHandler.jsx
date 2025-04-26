import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const getCookie = name =>
        document.cookie.split('; ').reduce((r, v) => {
          const [key, val] = v.split('=');
          return key === name ? decodeURIComponent(val) : r
        }, '');

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
