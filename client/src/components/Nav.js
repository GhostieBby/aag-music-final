import { useState } from 'react'
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'

import { getToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

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
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href={`/users/${userID}`}>Profile Page</Nav.Link>
            <Nav.Link href="/search">Search Users</Nav.Link>
          </Nav>
          <Form>
            <FormControl type="text" placeholder="Search Users" className="mr-sm-2" value={searchInput} onChange={handleSearchInputChange} />
            <Button variant="outline-primary" onClick={handleSearch}>Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
