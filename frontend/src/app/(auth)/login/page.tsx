'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from './actions'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const initialState = {
  ok: false,
  message: '',
  fieldErrors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.ok) {
      router.push('/dashboard')
    }
  }, [state.ok, router])

  return (
    <div>
      <h1>Login</h1>
      <form action={formAction}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
          {state?.fieldErrors?.email && <p>{state.fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
          {state?.fieldErrors?.password && <p>{state.fieldErrors.password}</p>}
        </div>
        {state?.message && <p>{state.message}</p>}
        <SubmitButton />
      </form>
    </div>
  )
}
