import { HttpError } from '../lib/errors.js'

export function securityHeadersMiddleware(request, response, next) {
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Frame-Options', 'DENY')
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
}

export function createCorsMiddleware(allowedOrigin) {
  return function corsMiddleware(request, response, next) {
    const requestOrigin = request.headers.origin

    if (allowedOrigin && requestOrigin === allowedOrigin) {
      response.setHeader('Access-Control-Allow-Origin', allowedOrigin)
      response.setHeader('Vary', 'Origin')
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    }

    if (request.method === 'OPTIONS') {
      return response.sendStatus(204)
    }

    return next()
  }
}

export function notFoundMiddleware(request, response, next) {
  next(new HttpError(404, 'Route not found.'))
}

export function errorHandlerMiddleware(error, request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({
      error: 'Request body must contain valid JSON.',
    })
  }

  const status = error instanceof HttpError ? error.status : 500
  const message = error instanceof HttpError ? error.message : 'Internal server error.'

  return response.status(status).json({
    error: message,
  })
}
