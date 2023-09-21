import { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Container, Nav, Navbar, Row, Col, Button } from 'react-bootstrap'

import { setToken, getToken } from '../utils/auth'
import { stateValues, fieldValues } from '../utils/common'

import ErrorModal from './ErrorModal'


export default function FormPage({ title, request, fields, redirect, onLoad }) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(stateValues(fields))
  const [errors, setErrors] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)

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
        } 

        if (title === 'Register') {
          navigate('/login')
        } 
  
      }
    } catch (error) {
      const errorMessage = error.response.data.message
      console.error(errorMessage)
      setErrors(errorMessage)
      setShowErrorModal(true)
    }
  }

  return (
    <section>
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} />}
      <h1>{title}</h1>
      <Container>
        <Row>
          {fields.length > 0 ?
            <Col as="form" onSubmit={handleSubmit}>
              {fieldValues(fields).map(field => {
                const { type, name, variable } = field
                return (
                  <Fragment key={variable}>
                    <label hidden htmlFor={variable}>{name}</label>
                    <input
                      type={type}
                      name={variable}
                      placeholder={name}
                      value={formData[variable]}
                      onChange={handleChange}
                    />
                  </Fragment>
                )
              })}
              {errors && <p>{errors}</p>}
              {<button type="submit">{title}</button>}
            </Col>
            :
            'Form Error'
          }
        </Row>
      </Container>
    </section>
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