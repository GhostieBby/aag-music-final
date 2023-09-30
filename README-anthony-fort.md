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

#### RecommendSong Component Pre-Edit

```
export default function RecommendSong() {
  const [formData, setFormData] = useState({
    songLink: '',
    recipientId: '',
  })
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }
  const recommendSong = async (e) => {
    e.preventDefault()
    try {
      //send POST request to server to save rec
      await axios.post('/api/recommendations', formData)
      //clear the form after submission
      setFormData({
        songLink: '',
        recipientId: '',
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <h2>Recommend a Song</h2>
      <form onSubmit={recommendSong}>
        <div className="mb-3">
          <label htmlFor="songLink" className="form-label">Song Link:</label>
          <input
            type="text"
            className="form-control"
            id="songLink"
            name="songLink"
            value={formData.songLink}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="recipientId" className="form-label">Recipient ID:</label>
          <input
            type="text"
            className="form-control"
            id="recipientId"
            name="recipientId"
            value={formData.recipientId}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Recommend</button>
      </form>
    </div>
  )
}
// on recipient's Pending Songs page, can display songs and allow them to accept or decline
// fetch and display the songs based on second user's id

```
#### RecommendSong Component Post-Edit

```
export default function RecommendSong() {
  const [targetUser, setTargetedUser] = useState(null)
  const { id } = useParams()
  const [showErrorModal, setShowErrorModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setTargetedUser(data)
      } catch (error) {
        console.error(error)
      }
    }
    getUserData()
  }, [id])

  const [formData, setFormData] = useState({
    soundCloudId: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const recommendSong = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/songs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setFormData({
        soundCloudId: '',
      })
      navigate(`/users/${id}`)
    } catch (error) {
      console.error(error)
      setShowErrorModal(true)
    }
  }

  return (
    <>
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />}
      {targetUser && (
        <div className="recommend-div">
          <h2>Recommend a Song to {targetUser.username}</h2>
          <form onSubmit={recommendSong}>
            <div className="mb-3">
              <label htmlFor="songLink" className="form-label">Song Link:</label>
              <input
                type="text"
                className="form-control"
                id="soundCloudId"
                name="soundCloudId"
                value={formData.soundCloudId}
                onChange={handleInputChange}
                placeholder="Go to Soundcloud, click the Share button paste the Embed link here"
              />
            </div>
            <button type="submit" className="btn btn-primary">Recommend</button>
          </form>
        </div>
      )}
    </>
  )
}

```
### Accepting a Song Recommendation From Another User

For a user to user to accept a song and add it to their playlist, there are two stages: firstly, they need to be able to retrieve and listen to the songs; secondly, they need the option of choosing whether or not to accept them. In the backend, the getPendingSongs function returns an array of songs for the user to choose from while the acceptSong function provides users with the capability to accept or decline a recommendation. The frontend is taken care of by the GetPendingSongs component. I wrote both backend functions and also the related frontend component.

The getPendingSongs function first uses req.params to obtain the id of the user who has had the recommendation made to them. Next, it uses the populate method to obtain the username of the user who made the recommendation. This is so that that username can be displayed on the frontend (instead of, say, a user id, which would mean less to the user reading it). Having used the find method to retrieve all the songs that have been recommended to that user, it uses a Set method to return a unique array of songs (to remove duplicate recommendations), and, in addition, returns only those songs where songAccepted is “undefined” (i.e., where the user has yet to make a final choice).

#### getPendingSongs Function

```
export const getPendingSongs = async (req, res) => {
  try {
    const { id } = req.params
    const songs = await Song.find({ recommendedTo: id }).populate('addedBy', 'username').exec()
    const removePendingSongs = new Set()
    const uniquePendingSongs = songs.filter((song) => {
      return song.songAccepted === undefined && !removePendingSongs.has(song.soundCloudId) && removePendingSongs.add(song.soundCloudId)
    })
    return res.json(uniquePendingSongs)
  } catch (error) {
    sendErrors(error, res)
  }
}
```

The acceptSong function allows a user to update the songAccepted value from “undefined” to either “true” or “false”, where “true” adds the song to their public playlist and “false” does not. It also calls the “updateLikes” function so that, if a user has had a recommendation accepted, they will receive a new “like”.

#### acceptSong Function

```
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
```

In the GetPendingSongs component, “Accept” and “Decline” buttons attached by an onClick method to the acceptRecommendation and declineRecommendation functions respectively. Both of these functions update the state of pendingSongs such that, whenever a user either accepts or declines a recommendation, that recommendation will be removed from the pending page.

### GetPendingSongs Component

```
export default function GetPendingSongs() {
  const { userId } = useParams()

  const [pendingSongs, setPendingSongs] = useState([])
  const [targetedUser, setTargetedUser] = useState(null)
  const [selectedSongId, setSelectedSongId] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [validateToken, setValidateToken] = useState(true)

  const [formData, setFormData] = useState({
    songAccepted: '',
  })

  useEffect(() => {
    async function getTargetedUserData() {
      try {
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setTargetedUser(data)
      } catch (error) {
        console.error(error)
      }
    }
    getTargetedUserData()
  }, [])

  useEffect(() => {
    async function getPendingSongsData() {
      try {
        const { data } = await axios.get(`/api/users/${userId}/songs`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setPendingSongs(data)
      } catch (error) {
        console.error(error)
        setShowErrorModal(true)
        setValidateToken(false)
      }
    }
    getPendingSongsData()
  }, [])

  const acceptRecommendation = async (songId) => {
    try {
      const updatedData = { ...formData, songAccepted: true }
      await axios.put(`/api/songs/${userId}/${songId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })

      setPendingSongs((songs) => songs.filter((song) => song._id !== songId))
    } catch (error) {
      console.error(error)
      setShowErrorModal(true)
    }
  }

  async function declineRecommendation(songId) {
    try {
      const updatedData = { ...formData, songAccepted: false }
      await axios.put(`/api/songs/${userId}/${songId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      setPendingSongs((prevSongs) => prevSongs.filter((song) => song._id !== songId))
    } catch (error) {
      console.error(error)
      setShowErrorModal(true)
    }
  }

  return (
    <>
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />}
      {validateToken ? (
        targetedUser ? (
          <>
            <div className='user-wrapper'>
              <div className='user-page'>
                <div className='pending-title'>
                  <h1>Pending Songs for {targetedUser.username}</h1>
                </div>
                <div className='pending-body'>
                  {pendingSongs.length > 0 ? (
                    <div>
                      {pendingSongs.map((song) => {
                        return (
                          <div key={song.soundCloudId}>
                            <button className='pending-button' onClick={() => setSelectedSongId(song.soundCloudId)}>
                              Click to hear a little song
                            </button>
                            <span>Sent with love from: <Link to={`/users/${song.addedBy._id}`} className="black-link">{song.addedBy.username}</Link></span>
                            <button className='pending-button' onClick={() => acceptRecommendation(song._id)}>Accept</button>
                            <button className='pending-button' onClick={() => declineRecommendation(song._id)}>Decline</button>
                          </div>
                        )
                      })}
                      {selectedSongId && (
                        <iframe
                          width="100%"
                          height="150"
                          allow="autoplay"
                          src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${selectedSongId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}>
                        </iframe>
                      )}
                    </div>
                  ) : (
                    <p>No songs pending</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null
      ) : (
        <p>Permission denied</p>
      )}
    </>
  )
}

```
### User Search

The SearchUsers component not only returns all users in descending order of “likes”, but also contains a search bar to filter out users by name. Again, another team member stubbed up the component, and I added some key functionality (again, see pre-edit and post-edit). The sort method was used in conjunction with a comparison function to order users by “likes.” Searches were handled by the handleKeyup function which would filter users whose username contained a substring that matched the user’s input. Crucially, I ensured that there was always a record of all users in the allUsers state. Without this, access to unsearched users would have been lost whenever a search was made.

#### SearchUsers Component Pre-Edit

```
export default function SearchUsers() {
  const [searchInput, setSearchInput] = useState('')
  const [searchBy, setSearchBy] = useState('username') // default for searching by username
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value)
  }
  const handleSearch = () => {
    if (searchBy === 'username') {
      // search by username logic
      console.log(`Searching by username: ${searchInput}`)
    } else if (searchBy === 'userId') {
      // search by user ID logic
      console.log(`Searching by userId: ${searchInput}`)
    }
  }
  return (
    <div>
      <h1>Search Users</h1>
      <div>
        <label>
          Search by:
          <select value={searchBy} onChange={handleSearchByChange}>
            <option value="username">Username</option>
            <option value="userId">User ID</option>
          </select>
        </label>
        <input type="text" placeholder={`Search by ${searchBy}`} value={searchInput} onChange={handleSearchInputChange} />
        <button onClick={handleSearch}>Searcg</button>
      </div>
      {/* (display search results here) */}
    </div>
  )
}
```

#### SearchUsers Component Post-Edit

```
export default function SearchUsers() {

  const [allUsers, setAllUsers] = useState()
  const [users, setUsers] = useState()

  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get('/api/users')
        data.sort(function (a, b) {
          return b.likes - a.likes
        })
        setAllUsers(data)
        setUsers(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [])

  function handleKeyup(event) {
    const selectedUsers = [...allUsers]
    const newSearchedUsers = selectedUsers.filter(user => user.username.toLowerCase().includes(event.target.value.toLowerCase()))
    setUsers(newSearchedUsers)
  }

  const [searchInput, setSearchInput] = useState('')
  const [searchBy, setSearchBy] = useState('username') // default for searching by username
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value)
  }
  const handleSearch = () => {
    if (searchBy === 'username') {
      // search by username logic
      console.log(`Searching by username: ${searchInput}`)
    } else if (searchBy === 'userId') {
      // search by user ID logic
      console.log(`Searching by userId: ${searchInput}`)
    }
  }
  return (
    <div>
      <div className='search-header'>
        <h1>Search Users</h1>
        <input onKeyUp={handleKeyup} placeholder='Search name' />
      </div>
      <section className='user-section'>
        {users && users.map(user => {
          return (
            <div key={user._id} value={user._id}>
              <Link to={`/users/${user._id}`}>{user.username}</Link>
              <p>Likes: {user.likes}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}
```
### Nav Bar

Again, another team member started the NavBar component, while I edited it to include certain functionalities (see pre-edit and post-edit). In particular, I ensured that the 'Profile Page' button would direct that user back to their own profile page, while the 'Get Pending Songs' button directed them to their own personal page of pending songs. To perform both of these, I used a getToken function to retrieve that user's id from the JSON web token.

#### NavBar Component Pre-Edit

```
export default function NavBar() {
  const [searchInput, setSearchInput] = useState('')
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  const handleSearch = () => {
    // can user search based on the searchInput value
    // can search by either username or user ID
    // i.e. can make API call to search users with the given input
    // update search results or nav to user's profile
    // add the search logic here
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">AAG Music</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/Register">Register</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/reviews">Reviews</Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search Users" className="mr-sm-2" value={searchInput} onChange={handleSearchInputChange} />
            <Button variant="outline-primary" onClick={handleSearch}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
```

#### NavBar Component Post-Edit

```
export default function NavBar() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }

  const token = getToken()
  if (!token) return false
  const payload = JSON.parse(window.atob(token.split('.')[1]))
  const userID = payload.sub

  return (
    <div className='nav-wrapper'>
      <Navbar bg="light" expand="lg" className="nav-bar">
        <Container>
          <Navbar.Brand href="/">AAG Music</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav:" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/register">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href={`/users/${userID}`}>Profile Page</Nav.Link>
              <Nav.Link href="/search">Search Users</Nav.Link>
              <Nav.Link href={`/users/${userID}/songs`}>Check pending songs</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

```

### Other Responsibilities

In addition to the code described above, I was also responsible for:

- Composing the User and Song schemata
- The loginUser and registerUser functions in the backend
- The getUserProfile and getAllUsers functions in the backend
- The deleteSong and udpateLikes functions in the backend
- Seeding the database with dummy users for testing
- Establishing backend routes in the routes.js file
- Establishing frontend paths in the App.js file
- Coding the UserProfile and ErrorModal components

## Learning Takeaways and Challenges

In my opinion, we made a mistake in the early stages of this project, which had a significant impact on how the rest of the project unfolded. Initially, we had agreed to code the backend, with each team member working on a particular segment. However, we did not set up the routes.js file (the file that specifies the backend endpoints) before splitting up to work on our separate functions.

In order to test my code (in Insomnia) while I was writing it, I made a separate project folder, similar to the main one, but including a marked-up routes file. It was in this environment that I wrote and tested my code, and additionally ended up writing code for functions that had not been assigned to me. In the end, I had produced a simple but functional backend. When the group reconvened, we struggled to make a working backend that incorporated code from all three group members, and, in the end, opted to fully adopt the backend I had written alone, which we pushed into a new repository, “aag-music-final.”

This was sub-optimal for several reasons. Firstly, it was not good practice on my part to be coding in a separate project folder; I should have been coding in the correct folder, making frequent commits to the shared GitHub repository. Secondly, it was inefficient because it meant that more than one person had been writing code for the same functionality, and that a lot of code was, as a result, never used. Thirdly, I think it possibly became challenging for all team members to contribute equally to the subsequent frontend work, given that, by that stage, we were short on time and I was so much more familiar with the structure of the backend that I was in a better position to write functional front end code quickly. For a group project, this was a shame, and, in my opinion, was a situation that could have been avoided had we made a better plan at the beginning. 

## Possible Improvements

### Logout

Currently, the app only has a Login feature, in which a JSON web token is issued and set to expire after seven days. Although the expiry date of the token cannot be altered, a logout feature could easily be implemented by removing the web token from local storage so that it cannot be accessed on the front end.

### Update Likes

I suspect that the updateLikes function would not be scalable in its current form. This is because it calculates the number of “likes” for a specific user by first fetching all of the songs on the entire database. Instead, I should have used the find method to return only those songs where the “addedBy” field matched the addedBy value that was accepted as an argument for the function.

### Error Modals

Currently, the error modals return a generic “permission denied” message in every situation. A more complete error handling would have returned a more specific error message in those situations where the user could have benefited from knowing a bit more about what they have done wrong. 

### Messy Code

For the most part, the code does not contain useful comments, which would have aided the collaboration process. Also, there is a lot of unused code left over, including broken code and code for features that we ended up not implementing as a result of running out of time. It would be good to remove unused code and to mark up what’s left with useful comments.

  
