import express from 'express'
import { registerUser, loginUser, getAllUsers, getUserProfile, updateProfile } from '../controllers/users.js'
import { secureRoute } from './secureRoute.js'
import { acceptSong, addSong, getAllSongs, getRecsByGivenUser, getPendingSongs, deleteSong } from '../controllers/songs.js'
import { addReview, deleteReview } from '../controllers/reviews.js'

// The router is an object that we'll attach routes to
// Each route will be a path and we will attach methods and controllers to them
const router = express.Router()

// ! Users
// Register route
router.route('/register')
  .post(registerUser)

// Login route 
router.route('/login')
  .post(loginUser)

// Profile route
// router.route('/profile')
//   .get(secureRoute, getUserProfile)

router.route('/users')
  .get(getAllUsers)

router.route('/songs/:id')
  .post(secureRoute, addSong)

router.route('/users/:id/songs')
.get(secureRoute, getPendingSongs)

router.route('/songs/:userId/:songId')
  .put(secureRoute, acceptSong)
  .delete(secureRoute, deleteSong)

router.route('/songs')
  .get(getAllSongs)

router.route('/recs/:id')
  .get(getRecsByGivenUser)

router.route('/reviews/:id')
  .post(secureRoute, addReview)

router.route('/users/:userId/reviews/:reviewId')
  .delete(secureRoute, deleteReview)

router.route('/users/:id')
  .get(secureRoute, getUserProfile)
  .put(secureRoute, updateProfile)

export default router