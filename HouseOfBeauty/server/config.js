function readRequiredEnv(name) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function readPort() {
  const rawPort = process.env.PORT?.trim()

  if (!rawPort) {
    return 8787
  }

  if (!/^\d+$/.test(rawPort)) {
    throw new Error('PORT must be a positive integer')
  }

  const parsedPort = Number.parseInt(rawPort, 10)

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error('PORT must be a positive integer')
  }

  return parsedPort
}

export const config = Object.freeze({
  appOrigin: process.env.APP_ORIGIN?.trim() ?? '',
  port: readPort(),
  supabaseUrl: readRequiredEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: readRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
})
