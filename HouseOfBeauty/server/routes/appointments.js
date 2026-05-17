import { Router } from 'express'
import { createAppointmentController } from '../controllers/createAppointmentController.js'

export const appointmentsRouter = Router()

appointmentsRouter.post('/', createAppointmentController)
