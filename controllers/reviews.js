import User from '../models/user.js'

// * Add Review
// post /users/:id --> id of the user whose profile is being reviewed
export const addReview = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    let stringifiedReqUser = JSON.stringify(req.user._id)
    stringifiedReqUser = stringifiedReqUser.slice(1, stringifiedReqUser.length - 1)
    if (stringifiedReqUser === id) {
      return res.status(403).json({ error: 'Cannot review your own profile' })
    }
    const reviewsAddedBy = user.reviews.map(review => {
      review = review.addedBy
      return JSON.stringify(review)
    })
    const reviewCheck = reviewsAddedBy.some(reviewId => {
      return reviewId.includes(stringifiedReqUser)
    })
    if (reviewCheck === true){
      return res.status(409).json({ error: 'Cannot review the same user more than once' })
    }
    user.reviews.push({ ...req.body, addedBy: req.user._id })
    await user.save()
    return res.status(201).json(user)
  } catch (error) {
    console.log(error)
  }
}

export const deleteReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params
    const user = await User.findById(userId)
    const reviewToDelete = user.reviews.id(reviewId)
    if (!reviewToDelete.addedBy.equals(req.user._id)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    reviewToDelete.deleteOne()
    await user.save()
    return res.sendStatus(204)
  } catch (error) {
    console.log(error)
  }
}