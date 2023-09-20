import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'

import { Container, Row, Col } from 'react-bootstrap'

import Image from 'react-bootstrap/Image'

export default function UserProfile() {

  const navigate = useNavigate()

  const [userProfile, setUserProfile] = useState(null)

  const { id } = useParams()

  function handleClick() {
    navigate('/users') // needs thinking
  }

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
    <>
      {userProfile ? (
        <div>
          <h1>{userProfile.username}</h1>
          <h2>Likes: {userProfile.likes}</h2>
          {userProfile.userSongs.length > 0 && 
            userProfile.userSongs.map(song => (
              <iframe
                key={song.soundCloudId} 
                width="100%"
                height="100"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${song.soundCloudId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}>
              </iframe>
            ))
          }
        </div>
      ) : null}
    </>
  )
  
}