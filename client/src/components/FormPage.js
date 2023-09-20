import React, { useState } from 'react'
import { Form, Button, Navbar, Container, Nav, Jumbotron, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { setToken, getToken } from '../utils/auth'
import { stateValues, fieldValues } from '../utils/common'


export default function FormPage({ title, request, fields, redirect, onLoad }) {

  const navigate = useNavigate()

  const [formData, setFormData] = useState(stateValues(fields))
  const [errors, setErrors] = useState('')

  useEffect(() => {
    async function fillFormFields() {
      try {
        const { data } = await onLoad()
        setFormData(data)
      } catch (error) {
        console.error(error)
        setErrors(error)
      }
    }
    if (onLoad) {
      fillFormFields()
    }
  }, [onLoad])

  async function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
    setErrors('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      const { data } = await request(formData)
      if (data.token) {
        setToken(data.token)
      }
      if (redirect) {

        const token = getToken()
        if (!token) return false
        const payload = JSON.parse(window.atob(token.split('.')[1]))
        const payloadExpiry = payload.exp
        const userID = payload.sub

        if (title === 'Login') {
          navigate(`/users/${userID}`)
        } else {
          navigate(redirect)
        }
  
      }
    } catch (error) {
      const errorMessage = error.response.data.message
      console.error(errorMessage)
      setErrors(errorMessage)
    }
  }

  return (
    <div>
      <header>
        <Navbar bg="light" expand="lg">
          <Container>
            <Nav className="mr-auto">
              <Nav.Link href="login">Login</Nav.Link>
              <Nav.Link href="users">Users</Nav.Link>
              <Nav.Link href="reviews">Reviews</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <div className="entry">
        <Container>
          <Row>
            <Col md={10}>
              <div className="text">
                <h1>AAG Music</h1>
                <h3>Where artists help each other get heard.</h3>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className='entry'>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {!isLogin && (
            <Form.Group controlId="passwordConfirmation">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Button variant="primary" type="submit">
            {isLogin ? 'Login' : 'Register'}
          </Button>
          {isLogin && (
            <Link to='/register'>
              <Button variant="secondary" onClick={() => onFormSubmit({ isLogin: false })}>
              Register
              </Button>
            </Link>
          )}
        </Form>
      </div>
      <footer>
        <Navbar bg="light" expand="lg">
          <Container>
            <Nav className="ml-auto">
              <Nav.Link href="about.html">About</Nav.Link>
              <Nav.Link href="contact.html">Contact</Nav.Link>
              <Nav.Link href="privacy.html">Privacy Policy (If we had one)</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </footer>
    </div>
  )

  // return (
  //   <div>
  //     <header>
  //       <Navbar bg="light" expand="lg">
  //         <Container>
  //           <Nav className="mr-auto">
  //             <Nav.Link href="login">Login</Nav.Link>
  //             <Nav.Link href="users">Users</Nav.Link>
  //             <Nav.Link href="reviews">Reviews</Nav.Link>
  //           </Nav>
  //         </Container>
  //       </Navbar>
  //     </header>
  //     <div className="entry">
  //       <Container>
  //         <Row>
  //           <Col md={6}>
  //             <div className="text">
  //               <h1>AAG Music</h1>
  //               <h3>Where artists help each other get heard.</h3>
  //             </div>
  //             <Form>
  //               <Form.Group controlId="username">
  //                 <Form.Control type="text" placeholder="Username" />
  //               </Form.Group>
  //               <Form.Group controlId="password">
  //                 <Form.Control type="password" placeholder="Password" />
  //               </Form.Group>
  //               <Button variant="primary" type="submit">Login</Button>
  //               <Button variant="secondary" type="button">Register</Button>
  //             </Form>
  //           </Col>
  //         </Row>
  //       </Container>
  //     </div>
  //     <footer>
  //       <Navbar bg="light" expand="lg">
  //         <Container>
  //           <Nav className="ml-auto">
  //             <Nav.Link href="about.html">About</Nav.Link>
  //             <Nav.Link href="contact.html">Contact</Nav.Link>
  //             <Nav.Link href="privacy.html">Privacy Policy (If we had one)</Nav.Link>
  //           </Nav>
  //         </Container>
  //       </Navbar>
  //     </footer>
  //   </div>
  // )
}