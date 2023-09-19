import mongoose from 'mongoose'

// * Custom classes
// All of our custom classes are going to extend the native ErrorConstructor that we have been using to throw errors into catch with a message

class CustomError extends Error {
  constructor(message, details){
    super(message)
    this.details = details
  }
}


export class UnprocessableEntity extends CustomError {
  constructor(message, details){
    super(message, details)
    this.name = 'UnprocessableEntity'
    this.status = 422
  }
}

export class NotFound extends CustomError {
  constructor(message, details){
    super(message, details)
    this.name = 'NotFound'
    this.status = 404
  }
}

export class Unauthorized extends CustomError {
  constructor(message, details){
    super(message, details)
    this.name = 'Unauthorized'
    this.status = 401
    this.errors = 'Unauthorized'
  }
}

export const checkId = (...ids) => {

  ids.forEach(id => {
    if (!mongoose.isValidObjectId(id)){
      throw new UnprocessableEntity('Invalid ObjectId', { 
        ObjectId: {
          name: 'ObjectId',
          message: `Invalid Object Id "${id}"`
        }
      })
    }
  })
}

export const sendErrors = (error, res) => {

  let { message, name, status, details, errors } = error

  // Set fallbacks
  status = status || 422
  details = errors || details || message || name

  console.log('------------------')
  console.log('Errors 👇')
  console.log('------------------')
  console.log('❌ Name:', status, name)
  console.log('❌ Message:', message)
  console.log('❌ details:', details)
  console.log('------------------')

  return res.status(status).json({ errors: details })
}