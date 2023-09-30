# Aag-music

## Introduction

This was my third project on the General Assembly Software Engineering Immersive. It was a group project (with two other coders), and lasted for just over a week (September 2023). The brief was to create and deploy a MERN-stack application.

AAG (which is an acronym made from the first initial of each coder) means “fire” in Hindi, a language spoken by another team member. On Aag Music, users can recommend songs from Soundcloud to other users. Users receive recommendations in an inbox and can play each song through a widget. If they like the song, they can add it to a playlist on their user profile page for others to listen to. Users who have their recommendations accepted are not only credited on the other user’s profile page, but also receive a “like”, which makes their profile appear earlier in user search queries.

The idea was that, eventually, a more sophisticated version of the app could be developed whereby users (ideally musicians with their own Soundcloud profiles) would sign up through their Soundcloud account. In this version, users would display a link to their own Soundcloud page, but would only be allowed to share music by other Aag Music users. The “like” system would incentivise users to help promote other musicians, because, by promoting others, they would increase their number of “likes”, making their own page more visible, and, in turn, making it more likely for people to click on a link to their Soundcloud page. However, such an idea is currently too ambitious.

## Planning

There were two strands of discussion which gave rise to the concept of Aag Music. First was the idea of hosting a platform for users to share their love of music by curating a playlist on their user profile page. The twist we introduced was that, in Aag Music, that curated list is made up entirely of suggestions by other users (although the user whose page it is gets the final say in which songs are accepted and which are not). 

The second point of discussion was whether or not it was feasible to attempt to consume the Spotify api in our app. We decided that it wasn’t and looked for alternatives. The breakthrough came when another team member learnt about the HTML iframe element, and how it could be used to embed the Soundcloud widget. 

I drew up a wireframe for the app.

## Key Features

### Recommending a Song to Another User

This feature was made possible through the addSong function in the backend and the RecommendSong component in the frontend. I wrote the addSong function and edited the RecommendSong component to make it functional.

The addSong function uses RegExp to extract the unique id from the song link, which is stored along with the ids of the user who made the recommendation (req.user._id) and the user to whom the song was recommended (identified using req.params).

#### addSong Function

```
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
    return res.status(201).json({ populatedSong })
  } catch (error) {
    sendErrors(error, res)
  }
}
```

Regarding the RecommendSong component, though I kept the outline provided by one of my collaborators, I made several adjustments (see pre-edit and post-edit below). I introduced user authorisation to ensure users could not make recommendations to themselves. I changed the formData state so that users only had to provide the song link (and not the id of the recipient user as well). I used useNavigate to redirect users to a new page after making a recommendation, and I introduced a modal to display in the event of a submission error.

#### Pre-Edit




