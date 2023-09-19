import { redirect } from 'react-router-dom'
import FormPage from './FormPage'
import axios from 'axios'

export default function Login() {
  const fields = [
    {
      type: 'email',
      name: 'Email',
    },
    {
      type: 'password',
      name: 'Password',
    }
  ]

  function login(formData) {
    return axios.post('/api/login', formData)
  }

  return (
    <FormPage title="Login" request={login} fields={fields} redirect="/users/:id" />
  )
}