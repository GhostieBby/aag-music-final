import React from 'react'
import FormPage from './FormPage'
import '../styles/components/FormPage.scss'

export default function Login() {
  const handleLoginSubmit = (formData) => {
    console.log('Login submitted with data:', formData)
  }

  return (
    <div>
      <FormPage onFormSubmit={handleLoginSubmit} isLogin={true} />
    </div>
  )
}