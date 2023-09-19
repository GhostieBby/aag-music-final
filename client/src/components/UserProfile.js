import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function UserProfile() {

  const [userProfile, setUserProfile] = useState(null)

  const { id } = useParams()

  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get(`/users/${id}`)
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