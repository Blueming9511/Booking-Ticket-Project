// import { useEffect, useState } from 'react'

// function UserProfile() {
//   const [user, setUser] = useState(null)
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/api/user', {
//           credentials: 'include', // Send cookies if needed
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error('Unauthorized: Please log in.')
//           }
//           throw new Error(`Error ${response.status}: ${response.statusText}`)
//         }

//         const data = await response.json()
//         setUser(data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUser()
//   }, [])

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return <div className="text-red-500">Error: {error}</div>
//   }

//   return (
//     <div className="container flex flex-col mx-auto p-4">
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//       <div className="mt-4">
//         <p>
//       <h1 className="text-3xl font-bold">User Profile</h1>
//           <strong>Name:</strong> {user?.name || 'N/A'}
//         </p>
//         <p>
//           <strong>Email:</strong> {user?.email || 'N/A'}
//         </p>
//         <p>
//           <strong>Provider:</strong> {user?.provider || 'N/A'}
//         </p>
//         {user?.picture && (
//           <img
//             src={user.picture}
//             alt="Profile"
//             className="w-24 h-24 rounded-full mt-2"
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// export default UserProfile
