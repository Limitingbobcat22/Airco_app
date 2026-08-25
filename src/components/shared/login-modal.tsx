import { Eye, EyeOff, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useAuth } from '@/hooks/use-auth'
import { useLoginModal } from '@/hooks/use-login-modal'
import { loginRequest } from '@/lib/api/auth'

export default function LoginModal() {
  const { isOpen, close } = useLoginModal()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setEmail('')
    setPassword('')
    setShowPassword(false)
    setError(null)
  }, [isOpen])

  const handleClose = () => {
    setError(null)
    setEmail('')
    setPassword('')
    setShowPassword(false)
    close()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await loginRequest(email.trim(), password)
      login(result.access_token, result.user)
      setEmail('')
      setPassword('')
      setShowPassword(false)
      close()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inloggen mislukt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title="Inloggen"
      description="Log in met je Airco & Warmte account"
      isOpen={isOpen}
      onClose={handleClose}
      className="sm:max-w-[425px]"
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight">Inloggen</h2>
          <p className="text-muted-foreground text-sm">
            Login is alleen voor personeel
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium">
            E-mail
          </label>
          <div className="relative">
            <input
              id="login-email"
              name="login-email"
              type="email"
              autoComplete="off"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              placeholder="Email addres"
            />
            {email ? (
              <button
                type="button"
                onClick={() => setEmail('')}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md"
                aria-label="E-mail wissen"
              >
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm font-medium">
            Wachtwoord
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pr-20 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              placeholder="••••••••"
            />
            <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center">
              {password ? (
                <button
                  type="button"
                  onClick={() => setPassword('')}
                  className="text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-md"
                  aria-label="Wachtwoord wissen"
                >
                  <X className="size-4" aria-hidden />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-md"
                aria-label={
                  showPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'
                }
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Bezig…' : 'Inloggen'}
        </Button>
      </form>
    </Modal>
  )
}
