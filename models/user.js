import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import Song from './song.js'

// * Schema Fields

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicUrl: { type: String, required: false },
  soundCloudUrl: { type: String, required: false },
  likes: { type: Number, default: 0, required: true },
  reviews: [reviewSchema],
  userSongs: [Song.schema],
})

// * Transform data that is converted to JSON when sending it back to the client
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, json) {
    delete json.password
  }
})

// * Virtual Field

userSchema
  .virtual('passwordConfirmation')
  .set(function (fieldValue) {

    this._passwordConfirmation = fieldValue
  })

// * 1. Pre validation
userSchema
  .pre('validate', function (next) {
    if (this.isModified('password') && this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Passwords do not match.')
    }
    next()
  })

// * 2. Pre save
userSchema
  .pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, 12)
    }
    next()
  })


userSchema.methods.validatePassword = function (plainTextPassword) {
  return bcrypt.compareSync(plainTextPassword, this.password)
}

export default mongoose.model('User', userSchema)