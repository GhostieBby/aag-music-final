import { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { setToken, getToken } from '../utils/auth'
import { stateValues, fieldValues } from '../utils/common'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


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
    <section>
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
}