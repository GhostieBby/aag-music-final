import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { NotFound, Unauthorized, sendErrors } from '../utils/errors.js'

export const registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body)
    return res.status(201).json({ message: `Welcome ${user.username}` })
  } catch (error) {
    sendErrors(error, res)
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const userToLogin = await User.findOne({ email: email })
    if (!userToLogin) throw new NotFound('User not found')
    if (!userToLogin.validatePassword(password)) throw new Unauthorized('Password invalid')
    const token = jwt.sign({ sub: userToLogin._id }, process.env.SECRET, { expiresIn: '7d' })
    return res.json({ message: `Welcome back, ${userToLogin.username}!`, token: token })
  } catch (error) {
    sendErrors(error, res)
  }
}

export const getUserProfile = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id).populate('userSongs.addedBy', 'username')
  return res.json(user)
}

export const getAllUsers = async (req, res) => {
  const users = await User.find()
  return res.json(users)
}

export const updateProfile = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  let stringifiedReqUser = JSON.stringify(req.user._id)
  stringifiedReqUser = stringifiedReqUser.slice(1, stringifiedReqUser.length - 1)
  if (stringifiedReqUser !== id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  Object.assign(user, req.body)
  await user.save()
  return res.json(user)
}


