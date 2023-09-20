import { useEffect, useState } from 'react'
import axios from 'axios'

import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'


export default function AcceptSong() {

  const { userId, songId } = useParams()
  const [ pendingSongs, setPendingSongs ] = useState([])
  const [song, setSong] = useState(null) //init song as null
  const [accepted, setAccepted] = useState(false) // track whether song is accepted

  useEffect(() => {
    async function getSong() {
      try {
        const { data } = await axios.get('/api/songs') //replace with actual API endpoint later
        setSong(data)
      } catch (error) {
        console.error(error)
      }
    }
    getSong()
  }, [])
  const acceptSong = async () => {
    try {
      await axios.put(`/api/songs/${song._id}`, { songAccepted: true }) // replace with actual API endpoint later
      setAccepted(true)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      {song && (
        <div>
          <h2>Song Details</h2>
          <p>Added By: {song.addedBy}</p>
          <p>Song Accepted: {song.songAccepted ? 'Yes' : 'No'}</p>
          {!accepted && (
            <Button variant='success' onClick={acceptSong}>
              Accept
            </Button>
          )}
        </div>
      )}
    </div>
  )
}


// Need to make sure server-side code handles these requests by updating 'songAccepted' in the database and moving the song to the user's profile