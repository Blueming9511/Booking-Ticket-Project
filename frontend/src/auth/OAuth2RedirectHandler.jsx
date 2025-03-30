import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // const token = new URLSearchParams(window.location.search).get("token");
    // if (token) {
    //     localStorage.setItem("jwt", token);
    //     navigate("/dashboard");
    // }

    const token = new URLSearchParams(window.location.search).get('token')
    localStorage.setItem('jwt', token)
    navigate('/dashboard')
  }, [])

  return <div>Logging in...</div>
}

export default OAuth2RedirectHandler
