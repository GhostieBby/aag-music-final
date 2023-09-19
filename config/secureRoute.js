import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { Unauthorized, sendErrors } from '../utils/errors.js'

// Define a function that will be executed just before a request hits the controller of a secure endpoint
export const secureRoute = async (req, res, next) => {
  try {
    // 1. Check to see if the user has sent an authorization header with their request
    if(!req.headers.authorization) throw new Unauthorized('Missing authorization header')
    // 2. Remove the 'Bearer ' from the beginning of the token, saving it to a token variable
    const token = req.headers.authorization.replace('Bearer ', '')

    // 3. Use a jwt method to verify the validity of the token itself
    // If the token is valid, the verify method will return the payload
    // If it fails, it will throw an error
    const { sub: userId } = jwt.verify(token, process.env.SECRET)

    // 4. if the token is valid, then we want to use the sub/subject from the token to check to see whether that user exists in our database
    const foundUser = await User.findById(userId)

    // 5. if they don't exist, invalidate the request by sending a 401 unauthorized
    if(!foundUser){
      throw new Unauthorized('User not found')
    }

    // 6. adding the foundUser document to the req object
    req.user = foundUser

    // 7. If they do exist, then they are authenticated and you can pass them onto the controller
    next()
  } catch (error) {
    sendErrors(error, res)
  }
}