import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Login() {
    
  return (
    <>
        <h1>Login Page</h1>
        <NavLink to={"/signup"}>Sign Up Instead</NavLink>
    </>
  )
}
