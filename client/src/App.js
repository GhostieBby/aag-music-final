import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import RecommendSong from './components/RecommendSong'
import Login from './components/Login'
import NavBar from './components/Nav'
import NotFound from './components/NotFound'
import Register from './components/Register'
import AcceptSong from './components/AcceptSong'
import UserProfile from './components/UserProfile'
import SearchUsers from './components/SearchUsers'
import GetPendingSongs from './components/GetPendingSongs'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/users/:id' element={<UserProfile />} />
          <Route path='/users' element={<SearchUsers />} />
          <Route path='/songs/:id' element={<RecommendSong />} />
          <Route path='/songs/:userId/:songId' element={<AcceptSong />} />
          <Route path='users/:userId/songs' element={<GetPendingSongs />} />
          <Route path='/search' element={<SearchUsers />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
