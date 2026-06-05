export const ADMIN_SESSION_COOKIE = 'admin_session'

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_SECRET ?? null
}

export function verifyAdminSession(value: string | undefined | null) {
  const token = getAdminSessionToken()
  return Boolean(token && value === token)
}
