import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'

export function sanitizeHtml(html) {
  const { window } = new JSDOM('<!DOCTYPE html>')
  const DOMPurify = createDOMPurify(window)
  return DOMPurify.sanitize(html, { ALLOW_DATA_ATTR: true, USE_PROFILES: { html: true } })
}
