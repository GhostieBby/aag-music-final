import React, { useState } from 'react'
import { Form, Button, Navbar, Container, Nav, Jumbotron, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function FormPage({ onFormSubmit, isLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onFormSubmit({ email, password, passwordConfirmation, isLogin })
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
}