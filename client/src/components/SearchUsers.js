import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function SearchUsers() {

  const [allUsers, setAllUsers] = useState()
  const [users, setUsers] = useState()


  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get('/api/users')
        data.sort(function (a, b) {
          return b.likes - a.likes
        })
        setAllUsers(data)
        setUsers(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [])

  function handleKeyup(event) {
    const selectedUsers = [...allUsers]
    const newSearchedUsers = selectedUsers.filter(user => user.username.toLowerCase().includes(event.target.value.toLowerCase()))
    setUsers(newSearchedUsers)
  }



  const [searchInput, setSearchInput] = useState('')
  const [searchBy, setSearchBy] = useState('username') // default for searching by username
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value)
  }
  const handleSearch = () => {
    if (searchBy === 'username') {
      // search by username logic
      console.log(`Searching by username: ${searchInput}`)
    } else if (searchBy === 'userId') {
      // search by user ID logic
      console.log(`Searching by userId: ${searchInput}`)
    }
  }
  return (
    <div>
      <div className='search-header'>
        <h1>Search Users</h1>
        <input onKeyUp={handleKeyup} placeholder='Search name' />
      </div>
      <section className='user-section'>
        {users && users.map(user => {
          return (
            <div key={user._id} value={user._id}>
              <Link to={`/users/${user._id}`}>{user.username}</Link>
              <p>Likes: {user.likes}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}