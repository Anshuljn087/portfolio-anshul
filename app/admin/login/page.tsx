import { Suspense } from 'react'
import { LoginForm } from '@/components/admin/login-form'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin Access</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the dashboard password to access protected routes.
        </p>
        <div className="mt-8">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function LoginFormFallback() {
  return (
    <div className="space-y-5">
      <div className="h-12 rounded-2xl border border-white/10 bg-white/[0.04]" />
      <div className="h-12 rounded-2xl border border-white/10 bg-white/[0.04]" />
    </div>
  )
}
