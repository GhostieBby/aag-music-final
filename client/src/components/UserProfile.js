import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import AcceptSong from './AcceptSong'

export default function UserProfile() {

  const [userProfile, setUserProfile] = useState(null)

  const { id } = useParams()

  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get(`/api/users/${id}`)
        setUserProfile(data)
      } catch (error) {
        console.error(error)
      }
    }
    getUserData()
  }, [id])

  console.log('USER PROFILE', userProfile)
  return (
    <div>
      <h1>WELCOME TO USER PAGE</h1>
      {userProfile && (
        <div>
          <h2>User Details</h2>
          <p>User ID: {userProfile._id}</p>
          <p>Name: {userProfile.name}</p>
        </div>
      )}
      <h2>Accepted Songs</h2>
      {userProfile && userProfile.acceptedSongs.length > 0 ? (
        <ul>
          {userProfile.acceptedSongs.map((song) => (
            <li key={song._id}>
              <AcceptSong song={song} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No accepted songs yet.</p>
      )}
    </div>
  )
}
