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
          {userProfile.userSongs.length > 0 && (
            <Container>
              <Row>
                {userProfile.userSongs.map(song => (
                  <Col key={song.soundCloudId}>{song.soundCloudId}</Col>
                ))}
              </Row>
            </Container>
          )}
        </div>
      ) : null}
    </>
  )
}