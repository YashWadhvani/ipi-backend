import { DateTime } from 'luxon'

export const APP_TIMEZONE = 'Asia/Kolkata'

/* -------------------------------
   INPUT (UI) → DB (UTC)
-------------------------------- */
export const istToUtcIso = (localIso?: string | null) => {
  if (!localIso) return null

  return DateTime
    .fromISO(localIso, { zone: APP_TIMEZONE })
    .toUTC()
    .toISO()
}

/* -------------------------------
   DB (UTC) → INPUT (datetime-local)
-------------------------------- */
export const utcToInputLocal = (utcIso?: string | null) => {
  if (!utcIso) return ''

  return DateTime
    .fromISO(utcIso, { zone: 'utc' })
    .setZone(APP_TIMEZONE)
    .toFormat("yyyy-MM-dd'T'HH:mm")
}

/* -------------------------------
   DB (UTC) → DISPLAY (human)
-------------------------------- */
export const utcToDisplay = (
  utcIso?: string | null,
  format = 'dd LLL yyyy, hh:mm a'
) => {
  if (!utcIso) return ''

  return DateTime
    .fromISO(utcIso, { zone: 'utc' })
    .setZone(APP_TIMEZONE)
    .toFormat(format)
}
