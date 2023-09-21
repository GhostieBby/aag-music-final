import React, { useState } from 'react'

export default function SearchUsers() {
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
        <button onClick={handleSearch}>Searcg</button>
      </div>
      {/* (display search results here) */}
    </div>
  )
}