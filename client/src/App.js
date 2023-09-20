import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import RecommendSong from './components/RecommendSong'
import Login from './components/Login'
import Nav from './components/Nav'
import NotFound from './components/NotFound'
import Register from './components/Register'
import AcceptSong from './components/AcceptSong'
import UserProfile from './components/UserProfile'
import SearchUsers from './components/SearchUsers'

export default function App() {
  useEffect(() => {
    async function getData() {
      try {
        const { data } = await axios.get('/users') // <---- Replace with your endpoint to test the proxy
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/users/:id' element={<UserProfile />} />
        <Route path='/users' element={<SearchUsers />} />
        <Route path='/songs/:id' element={<RecommendSong />} />
        <Route path='/songs/:userId/:songId' element={<AcceptSong />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}