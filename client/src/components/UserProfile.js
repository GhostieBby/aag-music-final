import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'

import { getToken } from '../utils/auth'

import { Container, Row, Col } from 'react-bootstrap'

import Image from 'react-bootstrap/Image'


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
        const { data } = await axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setUserProfile(data)
      } catch (error) {
        console.error(error)
      }
    }
    getUserData()
  }, [id])

  async function deleteSong(userId, songId) {
    try {
      await axios.delete(`/api/songs/${userId}/${songId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      const remainingSongs = userProfile.userSongs.filter((song) => {
        return song._id !== songId
      })
      setUserProfile({
        ...userProfile,
        userSongs: remainingSongs,
      })
    } catch (error) {
      console.log(error)
    }
  }

  

  console.log('USER PROFILE', userProfile)
  console.log('USER SONGS 0', userProfile.userSongs[0])
  return (
    <>
      {userProfile ? (
        <div>
          <h1>{userProfile.username}</h1>
          <h2>Likes: {userProfile.likes}</h2>
          <h3>{userProfile.username}&apos;s Songs</h3>
          {userProfile.userSongs.map(song => (
            <div key={song.soundCloudId}>
              <button onClick={() => setSelectedSongId(song.soundCloudId)}>
                Click to hear a little song
              </button>
              <Link to={`/users/${song.addedBy._id}`}>Sent with love from {song.addedBy.username}</Link>
              <button onClick={() => deleteSong(userProfile._id, song._id)}>
                Delete Song
              </button>
            </div>
          ))}
          {selectedSongId && (
            <iframe
              width="100%"
              height="300"  
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${selectedSongId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}>
            </iframe>
          )}
        </div>
      ) : null}
      <Link to={`/songs/${userProfile._id}`}>Click here to recommend a song to {userProfile.username}</Link>
      <Link to={`/users/${userProfile._id}/songs`}>Check pending songs</Link>
    </>
  )
  
}
