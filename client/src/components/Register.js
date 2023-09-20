import React from 'react'
import FormPage from './FormPage'

export default function RegisterPage() {
  const handleRegisterSubmit = (formData) => {
    console.log('Register submitted with data:', formData)
  }

  return (
    <div>
      <FormPage onFormSubmit={handleRegisterSubmit} isLogin={false} />
    </div>
  )
}