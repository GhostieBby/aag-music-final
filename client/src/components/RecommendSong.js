import React, { useState } from 'react'
import axios from 'axios'

export default function RecommendSong() {
  const [formData, setFormData] = useState({
    songLink: '',
    recipientId: '',
  })
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }
  const recommendSong = async (e) => {
    e.preventDefault()
    try {
      //send POST request to server to save rec
      await axios.post('/api/recommendations', formData)
      //clear the form after submission
      setFormData({
        songLink: '',
        recipientId: '',
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <h2>Recommend a Song</h2>
      <form onSubmit={recommendSong}>
        <div className="mb-3">
          <label htmlFor="songLink" className="form-label">Song Link:</label>
          <input
            type="text"
            className="form-control"
            id="songLink"
            name="songLink"
            value={formData.songLink}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="recipientId" className="form-label">Recipient ID:</label>
          <input
            type="text"
            className="form-control"
            id="recipientId"
            name="recipientId"
            value={formData.recipientId}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Recommend</button>
      </form>
    </div>
  )
}
// on recipient's Pending Songs page, can display songs and allow them to accept or decline
// fetch and display the songs based on second user's id