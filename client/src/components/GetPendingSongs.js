import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

import { getToken } from '../utils/auth'

export default function GetPendingSongs() {
  const { userId } = useParams()

  const [pendingSongs, setPendingSongs] = useState([])
  const [targetedUser, setTargetedUser] = useState(null)
  const [selectedSongId, setSelectedSongId] = useState(null)

  const [formData, setFormData] = useState({
    songAccepted: '',
  })

  useEffect(() => {
    async function getTargetedUserData() {
      try {
        const { data } = await axios.get(`/api/users/${userId}`)
        setTargetedUser(data)
      } catch (error) {
        console.error(error)
      }
    }
    getTargetedUserData()
  }, [])

  useEffect(() => {
    async function getPendingSongsData() {
      try {
        const { data } = await axios.get(`/api/users/${userId}/songs`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setPendingSongs(data)
      } catch (error) {
        console.error(error)
      }
    }
    getPendingSongsData()
  }, [])

  const acceptRecommendation = async (songId) => {
    try {
      const updatedData = { ...formData, songAccepted: true }
      await axios.put(`/api/songs/${userId}/${songId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function declineRecommendation(songId) {
    try {
      const updatedData = { ...formData, songAccepted: false }
      await axios.put(`/api/songs/${userId}/${songId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {targetedUser ? (
        <>
          <h1>Pending Songs for {targetedUser.username}</h1>
          {pendingSongs.length > 0 ?
            <div>
              {pendingSongs.map(song => {
                return (
                  <div key={song.soundCloudId}>
                    <button onClick={() => setSelectedSongId(song.soundCloudId)}>
                      Click to hear a little song
                    </button>
                    <Link to={`/users/${song.addedBy._id}`}>Sent with love from {song.addedBy.username}</Link>
                    <button onClick={() => acceptRecommendation(song._id)}>Accept</button>
                    <button onClick={() => declineRecommendation(song._id)}>Decline</button>
                  </div>
                )
              })}
              {selectedSongId && (
                <iframe
                  width="100%"
                  height="300"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${selectedSongId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}>
                </iframe>
              )}
            </div>
            : <p>No songs pending</p>
          }
        </>
      ) : null
      }
    </>
  )
}