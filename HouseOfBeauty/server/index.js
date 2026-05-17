import express from 'express'
import { config } from './config.js'
import {
  createCorsMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware,
  securityHeadersMiddleware,
} from './middleware/http.js'
import { appointmentsRouter } from './routes/appointments.js'

const app = express()

app.disable('x-powered-by')
app.use(securityHeadersMiddleware)
app.use(createCorsMiddleware(config.appOrigin))
app.use(express.json({ limit: '16kb' }))

app.get('/api/health', (request, response) => {
  response.status(200).json({
    ok: true,
  })
})

app.use('/api/appointments', appointmentsRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.listen(config.port, () => {
  console.log(`Appointment API listening on http://localhost:${config.port}`)
})
