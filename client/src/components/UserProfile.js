import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import ErrorModal from './ErrorModal'

import { getToken } from '../utils/auth'

export default function UserProfile() {

  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState({
    userSongs: [],
  })
  const [selectedSongId, setSelectedSongId] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
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

  const token = getToken()
  if (!token) return false
  const payload = JSON.parse(window.atob(token.split('.')[1]))
  const userID = payload.sub

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
      setShowErrorModal(true)
    }
  }

  return (
    <>
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />}
      <div className='user-page'>
        {userProfile ? (
          <div className='user-profile'>
            <h1>{userProfile.username}</h1>
            <h2>Likes: {userProfile.likes}</h2>
            <h3>Chosen by {userProfile.username}:</h3>
            {userProfile.userSongs.map(song => (
              <div key={song.soundCloudId}>
                <button className='pending-button' onClick={() => setSelectedSongId(song.soundCloudId)}>
                  Click to hear a little song
                </button>
                <span>Sent with love from: <Link to={`/users/${song.addedBy._id}`} className="black-link">{song.addedBy.username}</Link></span>
                <button className='pending-button' onClick={() => deleteSong(userProfile._id, song._id)}>
                  Delete Song
                </button>
              </div>
            ))}
            {selectedSongId && (
              <iframe
                width="60%"
                height="150"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${selectedSongId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}>
              </iframe>
            )}
          </div>
        ) : null}
        <div className='user-profile'>
          <span>Click <Link to={`/songs/${userProfile._id}`}>here</Link> to recommend a song to {userProfile.username}</span>
        </div>
      </div>
    </>
  )

}
