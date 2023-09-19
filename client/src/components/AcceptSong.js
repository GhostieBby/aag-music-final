import { useEffect, useState } from 'react'
import axios from 'axios'


export default function AcceptSong() {
  const [song, setSong] = useState()

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