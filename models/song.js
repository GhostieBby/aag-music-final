import mongoose from 'mongoose'

const songSchema = new mongoose.Schema({
  soundCloudId: { type: String, required: true },
  recommendedTo: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  addedBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  songAccepted: { type: Boolean, required: true },
})

export default mongoose.model('Song', songSchema)