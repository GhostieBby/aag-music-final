import { useEffect, useState } from 'react'
import axios from 'axios'

export default function SearchUsers() {

  const [allUsers, setAllUsers] = useState()
  const [users, setUsers] = useState()


  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get('/api/users')
        data.sort(function (a, b) {
          if (a.likes > b.likes) {
            return 1
          }
          if (a.likes < b.likes) {
            return -1
          } else {
            return 0
          }
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
      <h1>Search Users</h1>
      <div>
        <label>
          Search by:
          <select value={searchBy} onChange={handleSearchByChange}>
            <option value="username">Username</option>
            <option value="userId">User ID</option>
          </select>
        </label>
        <input type="text" placeholder={`Search by ${searchBy}`} value={searchInput} onChange={handleSearchInputChange} />
        <button onClick={handleSearch}>Search</button>
      </div>

      <input onKeyUp={handleKeyup}/>
      <section className='country-grid'>
        {users && users.map(user => {
          return (
            <div key={user._id} value={user._id}>
              <h2>{user.username}</h2>
              <p>Likes: {user.likes}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}