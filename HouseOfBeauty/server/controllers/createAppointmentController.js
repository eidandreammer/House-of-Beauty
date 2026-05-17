import { buildAppointmentInsert, mapAppointmentInsertError } from '../lib/appointments.js'
import { HttpError } from '../lib/errors.js'
import { getSupabaseAdminClient } from '../lib/supabaseAdmin.js'

const APPOINTMENT_SELECT_FIELDS = [
  'id',
  'customer_name',
  'email',
  'phone',
  'service_name',
  'duration_minutes',
  'status',
  'start_time',
  'end_time',
  'created_at',
  'updated_at',
].join(', ')

export async function createAppointmentController(request, response, next) {
  try {
    const appointmentInsert = buildAppointmentInsert(request.body)
    const supabaseAdmin = getSupabaseAdminClient()

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert(appointmentInsert)
      .select(APPOINTMENT_SELECT_FIELDS)
      .single()

    if (error) {
      const mappedError = mapAppointmentInsertError(error)
      throw new HttpError(mappedError.status, mappedError.message)
    }

    return response.status(201).json({
      data,
    })
  } catch (error) {
    return next(error)
  }
}
