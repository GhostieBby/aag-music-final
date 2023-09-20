import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { getToken } from '../utils/auth'
import ErrorModal from './ErrorModal'

export default function RecommendSong() {
  const [targetUser, setTargetedUser] = useState(null)
  const { id } = useParams()
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get(`/api/users/${id}`)
        setTargetedUser(data)
      } catch (error) {
        console.error(error)
      }
    }
    getUserData()
  }, [id])

  const [formData, setFormData] = useState({
    soundCloudId: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const recommendSong = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/songs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setFormData({
        soundCloudId: '',
      })
    } catch (error) {
      console.error(error)
      setShowErrorModal(true)
    }
  }

  return (
    <>
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />}
      {targetUser && (
        <div>
          <h2>Recommend a Song to {targetUser.username}</h2>
          <form onSubmit={recommendSong}>
            <div className="mb-3">
              <label htmlFor="songLink" className="form-label">Song Link:</label>
              <input
                type="text"
                className="form-control"
                id="soundCloudId"
                name="soundCloudId"
                value={formData.soundCloudId}
                onChange={handleInputChange}
              />

            </div>
            <button type="submit" className="btn btn-primary">Recommend</button>
          </form>
        </div>
      )}
    </>
  )
}
