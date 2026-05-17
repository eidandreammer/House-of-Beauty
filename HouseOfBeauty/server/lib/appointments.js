import { HttpError } from './errors.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ISO_8601_WITH_OFFSET_PATTERN = /(Z|[+-]\d{2}:\d{2})$/i
const APPOINTMENT_CONFLICT_MESSAGE =
  'Appointment overlaps an existing confirmed appointment. Please choose another time.'

function sanitizeText(value, fieldName, { minLength, maxLength }) {
  if (typeof value !== 'string') {
    throw new HttpError(400, `${fieldName} must be a string.`)
  }

  const sanitizedValue = value.trim()

  if (sanitizedValue.length < minLength || sanitizedValue.length > maxLength) {
    throw new HttpError(
      400,
      `${fieldName} must be between ${minLength} and ${maxLength} characters.`
    )
  }

  return sanitizedValue
}

function normalizePhoneNumber(value) {
  if (typeof value !== 'string') {
    throw new HttpError(400, 'phone must be a string.')
  }

  const trimmedValue = value.trim()
  const normalizedValue = trimmedValue.replace(/[^\d+]/g, '')

  if (!/^\+?\d{7,15}$/.test(normalizedValue)) {
    throw new HttpError(
      400,
      'phone must be a valid international or local number with 7 to 15 digits.'
    )
  }

  return normalizedValue
}

function parseDurationMinutes(value) {
  let durationValue = value

  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    if (!/^\d+$/.test(trimmedValue)) {
      throw new HttpError(400, 'duration must be an integer number of minutes.')
    }

    durationValue = Number(trimmedValue)
  }

  if (!Number.isInteger(durationValue)) {
    throw new HttpError(400, 'duration must be an integer number of minutes.')
  }

  if (durationValue < 15 || durationValue > 720) {
    throw new HttpError(400, 'duration must be between 15 and 720 minutes.')
  }

  if (durationValue % 5 !== 0) {
    throw new HttpError(400, 'duration must be in 5-minute increments.')
  }

  return durationValue
}

function parseStartTime(value) {
  if (typeof value !== 'string') {
    throw new HttpError(400, 'startTime must be a string.')
  }

  const trimmedValue = value.trim()

  if (!ISO_8601_WITH_OFFSET_PATTERN.test(trimmedValue)) {
    throw new HttpError(
      400,
      'startTime must be an ISO 8601 timestamp that includes a timezone offset or Z.'
    )
  }

  const parsedDate = new Date(trimmedValue)

  if (Number.isNaN(parsedDate.getTime())) {
    throw new HttpError(400, 'startTime is not a valid timestamp.')
  }

  return parsedDate
}

export function buildAppointmentInsert(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
    throw new HttpError(400, 'Request body must be a JSON object.')
  }

  const customerName = sanitizeText(
    rawPayload.customerName ?? rawPayload.customer_name,
    'customerName',
    { minLength: 2, maxLength: 120 }
  )
  const email = sanitizeText(rawPayload.email, 'email', {
    minLength: 5,
    maxLength: 320,
  }).toLowerCase()
  const phone = normalizePhoneNumber(rawPayload.phone)
  const serviceName = sanitizeText(
    rawPayload.serviceName ?? rawPayload.service_name,
    'serviceName',
    { minLength: 2, maxLength: 160 }
  )
  const durationMinutes = parseDurationMinutes(
    rawPayload.duration ?? rawPayload.durationMinutes ?? rawPayload.duration_minutes
  )
  const startTime = parseStartTime(rawPayload.startTime ?? rawPayload.start_time)

  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, 'email must be a valid email address.')
  }

  const endTime = new Date(startTime.getTime() + durationMinutes * 60_000)

  return {
    customer_name: customerName,
    email,
    phone,
    service_name: serviceName,
    duration_minutes: durationMinutes,
    status: 'confirmed',
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
  }
}

export function mapAppointmentInsertError(error) {
  if (error?.code === '23P01' || error?.message?.includes(APPOINTMENT_CONFLICT_MESSAGE)) {
    return {
      status: 409,
      message: APPOINTMENT_CONFLICT_MESSAGE,
    }
  }

  if (error?.code === '23514' || error?.code === '23502' || error?.code === '22P02') {
    return {
      status: 400,
      message: 'Appointment payload failed database validation.',
    }
  }

  return {
    status: 500,
    message: 'Unable to create appointment right now.',
  }
}
