import Song from '../models/song.js'
import { checkId, NotFound, Unauthorized, sendErrors } from '../utils/errors.js'

import User from '../models/user.js'

// Add a song to the list of the user with the id at the endpoint
export const addSong = async (req, res) => {
  try {
    const { id } = req.params
    const recommendedTo = id
    const recipient = await User.findById(id)

    const regex = /tracks\/(\d+)&/
    const match = regex.exec(req.body.soundCloudId)

    if (recipient.id == req.user._id) {
      return res.status(403).json({ error: 'Cannot add song to own playlist' })
    }
    const recipientSongs = recipient.userSongs.map(song => {
      return song.soundCloudId
    })
    const songDuplicationCheck = recipientSongs.some(song => {
      return song === match[1]
    })
    if (songDuplicationCheck === true) {
      return res.status(409).json({ error: 'Song already added to playlist' })
    }
    const songAdded = await Song.create({ ...req.body, soundCloudId: match[1], addedBy: req.user._id, recommendedTo, songAccepted: undefined })
    const populatedSong = await Song.findById(songAdded._id).populate('addedBy', 'username').exec()
    console.log('POPULATED SONG', populatedSong)
    return res.status(201).json({populatedSong})
  } catch (error) {
    sendErrors(error, res)
  }
}






// This fetches all the songs in the Users current list (accepted and not accepted)
export const getPendingSongs = async (req, res) => {
  try {
    const { id } = req.params
    const songs = await Song.find({ recommendedTo: id }).populate('addedBy', 'username').exec()
    const pendingSongs = songs.filter(song => {
      return song.songAccepted === undefined
    })
    const removePendingSongs = new Set()
    const uniquePendingSongs = songs.filter((song) => {
      if (!removePendingSongs.has(song.soundCloudId)){
        removePendingSongs.add(song.soundCloudId)
        return true
      }
      return false
    })
    return res.json(uniquePendingSongs)
  } catch (error) {
    sendErrors(error, res)
  }
}


export const getAllSongs = async (req, res) => {
  const songs = await Song.find()
  return res.json(songs)
}

export const acceptSong = async (req, res) => {
  try {
    const { userId, songId } = req.params
    let song = await Song.findById(songId)
    if (!song) {
      return res.status(404).json({ error: 'Song not found' })
    }
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    Object.assign(song, req.body)
    await song.save()
    const user = await User.findById(userId)
    if (song.songAccepted === true) {
      user.userSongs.push(song)
    }
    await user.save()
    updateLikes(song.addedBy)
    return res.json(song)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteSong = async (req, res) => {
  try {
    const { userId, songId } = req.params
    let song = await Song.findById(songId)
    if (!song) {
      return res.status(404).json({ error: 'Song not found' })
    }
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }
    const user = await User.findById(userId)
    user.userSongs.splice(user.userSongs.indexOf(song), 1)
    await user.save()
    const songDeleted = await Song.findByIdAndDelete(songId)
    if (!songDeleted) {
      return res.status(404).json({ error: 'Song not found' })
    }
    updateLikes(song.addedBy)
    return res.sendStatus(204)
  } catch (error) {
    console.error(error)
  }
}

export const updateLikes = async (addedBy) => {
  const allSongs = await Song.find()
  const user = await User.findById(addedBy)
  console.log(user)
  const recommendedSongs = allSongs.filter(song => {
    if (song.addedBy.equals(addedBy) && song.songAccepted === true)
      return song
  })
  user.likes = recommendedSongs.length
  console.log(user)
  await user.save()
}

export const getRecsByGivenUser = async (req, res) => {
  const { id } = req.params
  const allSongs = await Song.find()
  const recommendedSongs = allSongs.filter(song => {
    return song.addedBy == id && song.songAccepted === true
  })

  return res.json(recommendedSongs)
}