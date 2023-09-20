import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function UserProfile() {

  const navigate = useNavigate()

  const [userProfile, setUserProfile] = useState({
    userSongs: [],
  })
  const [ selectedSongId, setSelectedSongId ] = useState(null)

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
  return <h1>WELCOME TO USER PAGE</h1>
}
