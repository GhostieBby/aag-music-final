import { useEffect, useState } from 'react'
import axios from 'axios'

import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'


export default function AcceptSong() {

  const { userId, songId } = useParams()

  const [ pendingSongs, setPendingSongs ] = useState([])

  useEffect(() => {
    async function getSongId () {
      try {
        const { data } = await axios.get('/users')
      } catch (error) {
        console.error(error)
      }
    }
  })
}