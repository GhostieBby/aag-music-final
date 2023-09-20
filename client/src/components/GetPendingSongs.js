import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

import { getToken } from '../utils/auth'

export default function GetPendingSongs() {
  const { userId } = useParams()

  const [pendingSongs, setPendingSongs] = useState([])
  const [targetedUser, setTargetedUser] = useState(null)

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
                    <button>
                      Click to hear a little song
                    </button>
                    <Link to={`/users/${song.addedBy._id}`}>Sent with love from {song.addedBy.username}</Link>
                  </div>
                )
              })}
            </div>
            : <p>No songs pending</p>
          }
        </>
      ) : null}
    </>
  )
}