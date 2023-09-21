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
      <NavBar />
      <main>
        <div>
          {/* <iframe
            width="100%"
            height="100"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1527325330&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
          </iframe>
           */}
        </div>
        <Routes>
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
